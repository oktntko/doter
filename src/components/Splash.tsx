import { exec } from "child_process";
import { useEffect } from "react";
import log from "../plugins/log";

export const Splash = (props: { onEnter: () => void; onError: (message: string) => void }) => {
  useEffect(() => {
    exec(/*shell*/ "service docker status", (error, stdout) => {
      if (error) {
        log.error(error);
        props.onError(stdout);
      } else {
        props.onEnter();
      }
    });
  }, []);

  return (
    <button
      top={0}
      left={0}
      height={"100%"}
      width={"100%"}
      keyable
      mouse
      keys
      tags
      style={{ fg: "blue" }}
      content={`



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
{/}        `}
    ></button>
  );
};
