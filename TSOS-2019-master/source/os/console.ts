/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public bufferHistory = [],
                    public historyIndex = 0,
                    public tabList = [],
                    public tabIndex = 0) {
                    
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.bufferHistory.push(this.buffer);
                    this.historyIndex++;
                    // ... and reset our buffer.
                    this.buffer = "";
                } 
                else if (chr == String.fromCharCode(8)){
                    // backspace deletes a character and changes x y coordinates of cursor
                    this.backspace();
                }
                else if(chr == String.fromCharCode(9)){ // tab completion
                    if (this.buffer.length>0){
                        this.tabComplete();
                    }
                }
                else if(chr === "Ctrl-c"){ // terminate program
                    
                }
                else if(chr === "upArrow"){ // previous command
                    if (this.historyIndex != 0){
                        this.deleteCommand();
                        this.historyIndex--;

                        // change current command
                        this.putText(this.bufferHistory[this.historyIndex]);
                        this.buffer = (this.bufferHistory[this.historyIndex]);
                    }
                }
                else if(chr === "downArrow"){ // next command
                    if (this.historyIndex < this.bufferHistory.length - 1){
                        this.deleteCommand();
                        this.historyIndex++; 
                        // change command
                        this.putText(this.bufferHistory[this.historyIndex]);
                        this.buffer = this.bufferHistory[this.historyIndex]; 
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                
            }
        }
        public backspace(): void{
            // get char to be removed
            let str = this.buffer.charAt(this.buffer.length - 1);
            // find change in x coordinates
            var deltaX = _DrawingContext.measureText(this.currentFont, this.currentFontSize, str)
            this.currentXPosition = this.currentXPosition - deltaX;
            // remove drawing from console canvas 
            _DrawingContext.deleteText(this.currentFont,this.currentFontSize,this.currentXPosition,this.currentYPosition,str);
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize - _FontHeightMargin, deltaX,_DefaultFontSize +_FontHeightMargin *2);
            // remove from buffer
            this.buffer = this.buffer.slice(0,-1);
        }
        public deleteCommand(): void{
            while(this.buffer.length > 0){
                this.backspace();
            }
        }

        public tabComplete(): void{
            // If any commands in tablist cycle through options
            if (this.tabList.length > 1){
                this.deleteCommand();
                this.buffer = this.tabList[this.tabIndex];
                this.putText(this.buffer);
                if (this.tabIndex == this.tabList.length - 1){
                    this.tabIndex = 0;
                }else{
                    this.tabIndex++;
                }
            }
            // Create tab list with matching commands
            else{
                let reg = new RegExp(`^${this.buffer}`);
                this.tabList = [];
                this.tabIndex = 0;
                for (var i = 0; i < _OsShell.commandList.length; i++){
                    var str = _OsShell.commandList[i].command;
                    if(reg.test(str)){
                        this.tabList.push(_OsShell.commandList[i].command);
                    }
                }// print command
                if (this.tabList.length > 0){
                    this.deleteCommand();
                    this.buffer = this.tabList[this.tabIndex];
                    this.putText(this.buffer);
                    this.tabIndex++;
                }
            }

        }
        public lineWrap(text){
            let ray = [];
            let i =0; 
            let width = _Canvas.width;

            while(i < text.length){
                var offset = _DrawingContext.measureText(this.currentFont,this.currentFontSize, text.slice(0,i));
                if(this.currentXPosition + offset > width){
                    ray.push(text.slice(0,i-1));
                    text = text.slice(i - 1);
                    i=0;
                    width = 0;
                }
                i++;
            }
            ray.push(text);
            if (text === ray[0]){
                ray.push(ray[0]);
                ray[0] = "";
            }
            return ray;

        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                
                // handle line wrap if text reaches end of canvas width
                if (offset + this.currentXPosition > _Canvas.width){
                    if(text.length == 1){
                        this.advanceLine();
                        this.putText(text);
                    }
                    else{
                        // Line Wrap text
                        let newText = this.lineWrap(text);
                        let i =0;
                        while (i < newText.length){
                            if (newText[i] == ""){
                                i++;
                            }
                            else{
                                this.putText(newText[i]);
                                if (i<newText.length - 1) this.advanceLine();
                            }
                        }
                    }
                }
                else{
                    // draw normally 
                    _DrawingContext.drawText(this.currentFont,this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    this.currentXPosition = this.currentXPosition + offset;
                    this.buffer += text; 
                }
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            let lineHieght = _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
            this.currentYPosition += lineHieght;

            if(this.currentYPosition > _Canvas.height){
                // store canvas image
                let screenShot = _DrawingContext.getImageData(0,0, _Canvas.width,this.currentYPosition + _FontHeightMargin);
                let deltaY = this.currentYPosition - _Canvas.height + _FontHeightMargin;
                // clear screen
                this.clearScreen();
                // scroll up 
                _DrawingContext.putImageData(screenShot, 0, -deltaY);
                this.currentXPosition = 0;
                this.currentYPosition -= deltaY;
            }
            
        }
    }
 }
