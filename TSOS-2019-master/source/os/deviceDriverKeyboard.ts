/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            var isCtrl = params[2];
            var isCaps = params[3];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted + "ctrl" + isCtrl);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted ^ isCaps ) { // Checks for caps or shift 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                if (isCtrl && chr === "c"){ // checks for ctrl-c command
                    chr = "Ctrl-c";
                }
                
            } else if (   
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 9)                      ||   // tab
                        (keyCode == 8)) {                        // backspace
                chr = String.fromCharCode(keyCode);
                
            } else if (keyCode > 47 && keyCode < 58){
                if (isShifted ^ isCaps){ // Numbers and special characters
                    switch(keyCode){ 
                        case 48: 
                            chr = ")";
                            break;
                        case 49:  
                            chr = "!";
                            break;
                        case 50:
                            chr = "@";
                            break;
                        case 51:
                            chr = "#";
                            break;
                        case 52:
                            chr = "$";
                            break;
                        case 53:
                            chr = "%";
                            break;
                        case 54:
                            chr = "^";
                            break;
                        case 55:
                            chr = "&";
                            break;
                        case 56:
                            chr = "*";
                            break;
                        case 57:
                            chr = "(";
                            break;
                    }
                
                } else {
                    chr = String.fromCharCode(keyCode); // digits 
                }

                // Special characters
            } else if ((keyCode > 185 && keyCode < 193) 
                || (keyCode > 218 && keyCode < 223)){
                    switch (keyCode){
                        case 186:
                            chr = isShifted ? ":" : ";";
                            break;
                        case 187:
                            chr = isShifted ? "+" : "=";
                            break;
                        case 188:
                            chr = isShifted ? "<" : ",";
                            break;    
                        case 189:
                            chr = isShifted ? "_" : "-";
                            break;
                        case 190:
                            chr = isShifted ? ">" : ".";
                            break;
                        case 191:
                            chr = isShifted ? "?" : "/";
                            break;
                        case 192:
                            chr = isShifted ? "~" : "`";
                            break;
                        case 219:
                            chr = isShifted ? "{" : "[";
                            break;
                        case 220:
                            chr = isShifted ? "|" : "\\";
                            break;
                        case 221:
                            chr = isShifted ? "}" : "]";
                            break;
                        case 222:
                            chr = isShifted ? "\"" : "'";
                            break;
                    }
            } else if(keyCode == 38){ // upArrow
                chr = "upArrow";
            } else if(keyCode == 40){ // downArrow
                chr = "downArrow";
            }
            _KernelInputQueue.enqueue(chr);
        }
    }
}
