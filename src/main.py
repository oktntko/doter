from typing_extensions import Literal
import docker
from docker.models.containers import Container
from textual import log
from textual.app import App, ComposeResult
from textual.reactive import reactive
from textual.screen import Screen
from textual.widget import Widget
from textual.widgets import Button, Footer, Label, Static

from libs.textual import Div

# try:
client = docker.from_env()
# except docker.errors.DockerException:
#     # sock.connect(self.unix_socket)
#     # FileNotFoundError: [Errno 2] No such file or directory
#     # docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))
#     print(traceback.format_exc())


class DockerContainerCard(Div):

    status: reactive[Literal['running', 'restarting', 'paused', 'exited', '']] = reactive("")

    def __init__(self,
                 container: Container,
                 *children: Widget,
                 name: str | None = None,
                 id: str | None = None,
                 classes: str | None = None) -> None:
        super().__init__(*children, name=name, id=id, classes=classes)
        self.container = container

        self.status = container.status
        self.change_status_label = "|| stop" if container.status == "running" else ">> start"
        self.container_name = container.name
        self.image_tag = container.image.tags[0]

        ports: list[str] = []
        for container_port, host_ports in container.ports.items():
            for host in host_ports:
                ports.append(f"{host.get('HostIp', '')}:{host.get('HostPort', '')}->{container_port}")
        self.ports = ','.join(ports)

        self.project = container.labels.get("com.docker.compose.project", "")
        self.working_dir = container.labels.get("com.docker.compose.project.working_dir", "")

    def compose(self) -> ComposeResult:
        yield Div(
            Static(self.status, classes=self.container.status),
            Static(),
            Button(self.change_status_label, name="change_status"),
            classes="status"
        )

        yield Div(
            Div(Label("name :"), Button(self.container_name, name="container_name")),
            Div(Label("image:"), Button(self.image_tag, name="image_tag")),
            Div(Label("ports:"), Static(self.ports, )),
            classes="base"
        )

        yield Div(
            Div(Label("project    :"), Static(self.project, )),
            Div(Label("working_dir:"), Static(self.working_dir, )),
            classes="compose"
        )

    def action_change_status(self, ) -> None:
        log(self.container.status)

        if self.status == "running":
            self.container.stop()
        else:
            self.container.start()

        log(self.container.status)

    def action_move_container(self, ) -> None:
        self.app.push_screen('containers')

    def action_move_image(self, ) -> None:
        self.app.push_screen('containers')

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.name == "change_status":
            self.action_change_status()
        if event.button.name == "container_name":
            self.action_change_status()
        if event.button.name == "image_tag":
            self.action_change_status()


class ContainersScreen(Screen):
    BINDINGS = [("f5", "reload", "Reload Containers")]

    containers: reactive[list[Container]] = reactive(client.containers.list(all=True))

    def compose(self) -> ComposeResult:
        yield Sidebar()
        yield Div(*[DockerContainerCard(container) for container in self.containers],)
        yield Footer()

    def action_reload(self, ) -> None:
        log("action_reload")
        self.containers = client.containers.list(all=True)
        cards = self.query("DockerContainerCard")
        if cards:
            cards.refresh()


class ImagesScreen(Screen):
    BINDINGS = [("b", "app.pop_screen", "Pop screen")]

    def compose(self) -> ComposeResult:
        yield Sidebar()
        yield Static("One")
        yield Static("Two")
        yield Footer()


class NetworksScreen(Screen):
    BINDINGS = [("c", "app.pop_screen", "Pop screen")]

    def compose(self) -> ComposeResult:
        yield Sidebar()
        yield Static("One")
        yield Static("Two")
        yield Footer()


class VolumesScreen(Screen):
    BINDINGS = [("d", "app.pop_screen", "Pop screen")]

    def compose(self) -> ComposeResult:
        yield Sidebar()
        yield Static("One")
        yield Static("Two")
        yield Footer()


class Sidebar(Widget):
    def compose(self) -> ComposeResult:
        yield Button("containers", id="containers")
        yield Button("images", id="images")
        yield Button("networks", id="networks")
        yield Button("volumes", id="volumes")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "containers":
            self.app.switch_screen('containers')
        elif event.button.id == "images":
            self.app.switch_screen('images')
        elif event.button.id == "networks":
            self.app.switch_screen('networks')
        elif event.button.id == "volumes":
            self.app.switch_screen('volumes')


class DoterApp(App):
    CSS_PATH = "main.css"
    TITLE = "Doter ~ I want to Docker Desktop even with Terminal! ~"
    SCREENS = {
        "containers": ContainersScreen(),
        "images": ImagesScreen(),
        "networks": NetworksScreen(),
        "volumes": VolumesScreen(),
    }

    def on_mount(self) -> None:
        self.push_screen('containers')


if __name__ == "__main__":
    app = DoterApp()
    app.run()
