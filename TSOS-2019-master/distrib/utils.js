/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
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
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        Utils.updateGUI = function () {
            this.updateCPUgui();
            if (!_Scheduler.readyQueue.isEmpty())
                this.updatePCBgui();
            this.updateMemoryTable();
            document.getElementById("status").innerHTML = _Status;
        };
        Utils.updateCPUgui = function () {
            document.getElementById("PC").innerHTML = _CPU.PC.toString(16).toUpperCase();
            document.getElementById("IR").innerHTML = _CPU.IR.toString().toUpperCase();
            document.getElementById("ACC").innerHTML = _CPU.Acc.toString(16).toUpperCase();
            document.getElementById("X").innerHTML = _CPU.Xreg.toString(16).toUpperCase();
            document.getElementById("Y").innerHTML = _CPU.Yreg.toString(16).toUpperCase();
            document.getElementById("Z").innerHTML = _CPU.Zflag.toString(16).toUpperCase();
        };
        Utils.updatePCBgui = function () {
            var html = "";
            for (var i = 0; i < _ResidentList.length; i++) {
                var process = _ResidentList[i];
                if (process.state === "Ready" || process.state === "Running") {
                    html += "<tr><td>" + process.pid + "</td><td>" + process.PC + "</td><td>" + process.IR + "</td><td>" + process.Acc + "</td>\n                    <td>" + process.Xreg + "</td><td>" + process.Yreg + "</td><td>" + process.Zflag + "</td><td>" + process.base + "</td><td>" + process.limit + "</td>\n                    <td>" + process.state + "</td>";
                }
            }
            document.getElementById("readyqueue").innerHTML = html;
        };
        Utils.createMemoryTable = function () {
            var html = "<table style='width: 100%;'><tbody>";
            for (var i = 0; i < _MemorySize; i++) {
                if (i % 8 == 0) {
                    html += "<tr><td>0x" + i.toString(16).toUpperCase() + "</td>";
                }
                html += "<td id=\"loc" + i + "\">00</td>";
                if (i % 8 == 7) {
                    html += "</tr>";
                }
            }
            html += "</tbody></table>";
            document.getElementById("Memorytable").innerHTML = html;
        };
        Utils.updateMemoryTable = function () {
            for (var i = 0; i < _Memory.locations.length; i++) {
                if (_Memory.locations[i] != null)
                    document.getElementById("loc" + i).innerHTML = _Memory.locations[i];
            }
        };
        return Utils;
    }());
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
