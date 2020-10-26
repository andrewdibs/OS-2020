/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        public static updateGUI(){
            this.updateCPUgui();
          //  if (!_Scheduler.readyQueue.isEmpty())
            //    this.updatePCBgui();
            this.updateMemoryTable();
            document.getElementById("status").innerHTML = _Status;
        }
        public static updateCPUgui(){
            document.getElementById("PC").innerHTML = _CPU.PC.toString(16).toUpperCase();
            document.getElementById("IR").innerHTML = _CPU.IR.toString().toUpperCase();
            document.getElementById("ACC").innerHTML = _CPU.Acc.toString(16).toUpperCase();
            document.getElementById("X").innerHTML = _CPU.Xreg.toString(16).toUpperCase();
            document.getElementById("Y").innerHTML = _CPU.Yreg.toString(16).toUpperCase();
            document.getElementById("Z").innerHTML = _CPU.Zflag.toString(16).toUpperCase();
        }

        public static updatePCBgui(){
            
            document.getElementById("pcbPID").innerHTML = _CurPCB.pid.toString();
            document.getElementById("pcbPC").innerHTML = _CurPCB.PC.toString(16).toUpperCase();
            document.getElementById("pcbIR").innerHTML = _CurPCB.IR.toString().toUpperCase();
            document.getElementById("pcbACC").innerHTML = _CurPCB.Acc.toString(16).toUpperCase();
            document.getElementById("pcbX").innerHTML = _CurPCB.Xreg.toString(16).toUpperCase();
            document.getElementById("pcbY").innerHTML = _CurPCB.Yreg.toString(16).toUpperCase();
            document.getElementById("pcbZ").innerHTML = _CurPCB.Zflag.toString(16).toUpperCase();
            document.getElementById("pcbBase").innerHTML = _CurPCB.base.toString();
            document.getElementById("pcbLimit").innerHTML = _CurPCB.limit.toString();
            document.getElementById("pcbState").innerHTML = _CurPCB.state.toString().toUpperCase();
        }

        public static createMemoryTable(){
            var html = "<table style='width: 100%;'><tbody>";
            for (var i = 0; i < _MemorySize; i++){
                if (i % 8 == 0){
                    html += `<tr><td>0x${i.toString(16).toUpperCase()}</td>`;
                }
                html += `<td id="loc${i}">00</td>`;
                if(i % 8 == 7){
                    html += "</tr>";
                }
            }
            html += "</tbody></table>";
            document.getElementById("Memorytable").innerHTML = html;
        }

        public static updateMemoryTable(){
            for (var i = 0; i < _Memory.locations.length;i++){
                if(_Memory.locations[i] != null)
                    document.getElementById("loc" + i).innerHTML = _Memory.locations[i];
            }
        }
    }
}
