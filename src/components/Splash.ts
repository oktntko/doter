import type { Widgets } from "blessed";
import blessed from "blessed";
import type { ExecException } from "child_process";
import { exec } from "child_process";
import type { Position } from "../app";

export const attach = (
  screen: Widgets.Screen,
  position: Position,
  onEnter: (screen: Widgets.Screen) => void,
  onError: (screen: Widgets.Screen, error: ExecException) => void
) => {
  const splash = blessed.button({
    parent: screen,
    top: position.top,
    left: position.left,
    height: position.height,
    width: position.width,
    mouse: true,
    keys: true,
    tags: true,
    style: { fg: "blue" },
    content: `



                                                                                                                       1-..
                                                                                                                        <?=?.          /|.>
                                                                                                                          ????==    ?/==1.
                                                                                                                          .=?z=?<...==-'
                                                                                                                         (?=?! <?=?<'
                                                                                      .....J+J......                   .+?=<!>
                                                                               ....gMMMMMMMMMMMMMMMMMMNNNg...?!      .(??!>
                                                                             .dNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNg..  .(<!>
                                                                           .MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN.
                                                                          (MMMMMN{green-bg}   {/}MMMMMMMMMMMMMMMMMMMNMMNMMNMMMMMMNe
                                                                         (MMMMMNMMN{green-bg}   {/}MMMMMMMNMMNMMMMMMMMMMNMMMMNMMMMMN,
                                                                        dMMMMNMMMMMMM{green-bg}   {/}MMMNMMMMMMMMMMNMMMMMMMMMMNMMMMMN,
                                                                        MMMMMMMMNMM{green-bg}   {/}MMMMMMMMMMMMMMMMNMMNMMMMMNMMMMMMMNMMMN,
                                                                        MMMMMMMNM{green-bg}   {/}MMMMMMMMMMMMMMMMMMMMMMMMNMMMMMNMMMMMMMMMMp
                                                                       .JMNMMNMMMMMMMMMMMMM{green-bg}         {/}MMMNMMNMMMNMMNMMNMNMMNMMMNe.
                                                                        ,MMMMMMMNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMN,              .gp
                                                                         (MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMNMNMMNMMNMMNMMMMMNMMMMk.            .MMm,          +gg,
                                                                          .MM=!' ,      .      ("""MMMMNMMMMMMNMMMMMMMMNMMMNMMMMMMN,            -MMMN      ..+g,
                                                                        jn.(W(-  q      ,1,.         (YMMMNMMMMMMNMMNMMMNMMMMMNMMMMMNJ.   '      MMMMN-..-MMMB>
                                                                    '    ?WAZNA, .l        .=(.    "4(,  (""""HMMMMNMMMMMMNMMMMNMMMMMMNm..       (MMMMMMMMM#"^
                                                                           .^ ~5.  ?o         4.       7,        THMMMNMMMMMNMMMNMMNMMMMMNm&,    .MMMMMMMB'
                                                                       ...      .i. .=(.       4        7.          ?TMMNMMMMMMMMMMMMMMMMMMMMNNmgMMMMMM@'
                                                                   ...             ?<.  ?&..   ,|         ?L            ?HMNMMNMMNMMNMMNMMMMMMMMMMMMMM=
                                                                          ........    ^...  ?"C .5..        ?C(.          ."MMMMNMMMMNMMMNMMNMMMMMMMD
                                                                    '         _?7"4WmJ...   '?????+.??7=+.      ?=(...       .THMMMMMMMMMMMMMMNMM"'
                                                                                     ?7"U3          ?!-...7^          !??""'        ??7TMMM#"^   ..+w{
                                                                       '                                     _??_............._____????'    ..JQVY7!
                                                                                                                                   ..JJ+dXVY""!


{green-fg}
                                                                                                                  ,----,
                                                                                                                ,/   .'|
                                                                                     ,---,                    ,'   .'  :     ,---,. ,-.----.
                                                                                   .'  .' '\\                ;    ;     /   ,'  .' | \\    /  \\
                                                                                 ,---.'     \\     ,---.   .'___,/    ,'  ,---.'   | ;   :    \\
                                                                                 |   |  .'\\  |   '   ,'\\  |    :     |   |   |   .' |   | .\\ :
                                                                                 :   : |  '  |  /   /   | ;    |.';  ;   :   :  |-, .   : |: |
                                                                                 |   ' '  ;  : .   ; ,. : '----'  |  |   :   |  ;/| |   |  \\ :
                                                                                 '   | ;  .  | '   | |: :     '   :  ;   |   :   .' |   : .  /
                                                                                 |   | :  |  ' '   | .; :     |   |  '   |   |  |-, ;   | |  \\
                                                                                 '   : | /  ;  |   :    |     '   :  |   '   :  ;/| |   | ;\\  \\
                                                                                 |   | '' ,/    \\   \\  /      ;   |.'    |   |    \\ :   ' | \\.'
                                                                                 ;   :  .'       '----'       '---'      |   :   .' :   : :-'
                                                                                 |   ,.'                                 |   | ,'   |   |.'
                                                                                 '---'                                   '----'     '---'
{/}      `,
  });

  exec(/*shell*/ "service docker status", (error, stdout) => {
    if (error) {
      blessed.message({
        parent: splash,
        content: stdout,
        top: "45%",
        left: "40%",
        height: "10%",
        width: "20%",
        mouse: true,
        keys: true,
        tags: true,
        align: "center",
        border: "line",
        style: {
          border: { type: "line", fg: "red" },
        },
      });
      screen.render();

      splash.on("press", () => onError(screen, error));
      splash.on("click", () => onError(screen, error));
    } else {
      splash.on("press", () => onEnter(screen));
      splash.on("click", () => onEnter(screen));
    }
  });

  return splash;
};

/** base
                                                                                                                       1-..
                                                                                                                        <?=?.          /|.>
                                                                                                                          ????==    ?/==1.
                                                                                                                          .=?z=?<...==-'
                                                                                                                         (?=?! <?=?<'
                                                                                      .....J+J......                   .+?=<!>
                                                                               ....gMMMMMMMMMMMMMMMMMMNNNg...?!      .(??!>
                                                                             .dNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNg..  .(<!>
                                                                           .MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN.
                                                                          (MMMMMN   MMMMMMMMMMMMMMMMMMMNMMNMMNMMMMMMNe
                                                                         (MMMMMNMMN   MMMMMMMNMMNMMMMMMMMMMNMMMMNMMMMMN,
                                                                        dMMMMMMNMMMMMMM   MMMNMMMMMMMMMMNMMMMMMMMMMNMMMMMN,
                                                                        MMMMMMMMNMM   MMMMMMMMMMMMMMMMNMMNMMMMMNMMMMMMMNMMMN,
                                                                        MMMMMMMNM   MMMMMMMMMMMMMMMMMMMMMMMMNMMMMMNMMMMMMMMMMp
                                                                       .JMNMMNMMMMMMMMMMMMM         MMMNMMNMMMNMMNMMNMNMMNMMMNe.
                                                                        ,MMMMMMMNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMN,              .gp
                                                                         (MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMNMNMMNMMNMMNMMMMMNMMMMk.            .MMm,          +gg,
                                                                          .MM=!' ,      .      ("""MMMMNMMMMMMNMMMMMMMMNMMMNMMMMMMN,            -MMMN      ..+g,
                                                                        jn.(W(-  q      ,1,.         (YMMMNMMMMMMNMMNMMMNMMMMMNMMMMMNJ.   '      MMMMN-..-MMMB>
                                                                    '    ?WAZNA, .l        .=(.    "4(,  (""""HMMMMNMMMMMMNMMMMNMMMMMMNm..       (MMMMMMMMM#"^
                                                                           .^ ~5.  ?o         4.       7,        THMMMNMMMMMNMMMNMMNMMMMMNm&,    .MMMMMMMB'
                                                                       ...      .i. .=(.       4        7.          ?TMMNMMMMMMMMMMMMMMMMMMMMNNmgMMMMMM@'
                                                                   ...             ?<.  ?&..   ,|         ?L            ?HMNMMNMMNMMNMMNMMMMMMMMMMMMMM=
                                                                          ........    ^...  ?"C .5..        ?C(.          ."MMMMNMMMMNMMMNMMNMMMMMMMD
                                                                    '         _?7"4WmJ...   '?????+.??7=+.      ?=(...       .THMMMMMMMMMMMMMMNMM"'
                                                                                     ?7"U3          ?!-...7^          !??""'        ??7TMMM#"^   ..+w{
                                                                       '                                     _??_............._____????'    ..JQVY7!
                                                                                                                                   ..JJ+dXVY""!



                                                                                                                  ,----,
                                                                                                                ,/   .'|
                                                                                     ,---,                    ,'   .'  :     ,---,. ,-.----.
                                                                                   .'  .' '\                ;    ;     /   ,'  .' | \    /  \
                                                                                 ,---.'     \     ,---.   .'___,/    ,'  ,---.'   | ;   :    \
                                                                                 |   |  .'\  |   '   ,'\  |    :     |   |   |   .' |   | .\ :
                                                                                 :   : |  '  |  /   /   | ;    |.';  ;   :   :  |-, .   : |: |
                                                                                 |   ' '  ;  : .   ; ,. : '----'  |  |   :   |  ;/| |   |  \ :
                                                                                 '   | ;  .  | '   | |: :     '   :  ;   |   :   .' |   : .  /
                                                                                 |   | :  |  ' '   | .; :     |   |  '   |   |  |-, ;   | |  \
                                                                                 '   : | /  ;  |   :    |     '   :  |   '   :  ;/| |   | ;\  \
                                                                                 |   | '' ,/    \   \  /      ;   |.'    |   |    \ :   ' | \.'
                                                                                 ;   :  .'       '----'       '---'      |   :   .' :   : :-'
                                                                                 |   ,.'                                 |   | ,'   |   |.'
                                                                                 '---'                                   '----'     '---'

   */
