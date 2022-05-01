import blessed, { Widgets } from "blessed";
import contrib from "blessed-contrib";

export const attach = (
  screen: Widgets.Screen,
  grid: contrib.grid,
  position: { top: number; left: number; height: number; width: number },
  onEnter: (screen: Widgets.Screen) => void
) => {
  const splash: Widgets.ButtonElement = grid.set(
    position.top,
    position.left,
    position.height,
    position.width,
    blessed.button,
    {
      parent: screen,
      mouse: true,
      keys: true,
      border: {
        type: "line",
      },
      style: {
        fg: "blue",
      },
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
      `,
    }
  );

  splash.on("press", () => onEnter(screen));
  splash.on("click", () => onEnter(screen));

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
