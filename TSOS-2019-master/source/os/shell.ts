/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    
    export class Shell {
        
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDateTime,
                                  "date",
                                  "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Lets you know where you are.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // BSOD
            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- triggers a kernel trap error.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // fortune
            sc = new ShellCommand(this.shellFortune,
                                  "fortune",
                                  "- Tells you a fortune.")
            this.commandList[this.commandList.length] = sc;

            // status <string> - sets the status to the specified string
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - sets the status to the specified string");
            this.commandList[this.commandList.length] = sc;
            
            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- Loads the program in Program input.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<PID> - Runs the program assigned to the given PID.");
            this.commandList[this.commandList.length] = sc;
            
            // runall 
            sc = new ShellCommand(this.shellRunAll,
                                  "runall",
                                  "- Runs all running processes.");
            this.commandList[this.commandList.length] = sc;
            
            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPs,
                                  "ps",
                                  "- List the running processes and their IDs");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<id> - Kill the specified process id");
            this.commandList[this.commandList.length] = sc;

            // killall- kills all running processes.
            sc = new ShellCommand(this.shellKillAll,
                                  "killall",
                                  "- Kills all running processes.");
            this.commandList[this.commandList.length] = sc;

            // clearmem - clears all memory partions
            sc = new ShellCommand(this.shellClearMem,
                                  "clearmem",
                                  "- Clears all memory partions.");
            this.commandList[this.commandList.length] = sc;

            // quanum <int> - sets the quantum
            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "<int> - Sets quantum to specified integer.");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText("dibsOS version " + "0.1");
        }

        public shellDateTime(args: string[]){
            let date = new Date();
            _StdOut.putText(date);
        }

        public shellWhereAmI(args: string[]){
            _StdOut.putText("lost");

        }

        public shellBSOD(args: string[]){
            _StdOut.putText("Kernel Trap Error!");
            _Kernel.krnTrapError("BSOD AHHH");
        }

        public shellFortune(args: string[]){
            _StdOut.putText("you are not illiterate.. :)");

        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellLoad(args: string[]){
            let program = _ProgramInputBox.value;
            // remove white space
            let codeList = program.toUpperCase().split(" "); 
            program = program.toUpperCase().replace(/\s/g,"");
            // validate only hex Symbols
            let regex = /^[0-9A-Fa-f]+$/;
            // set default priority to 0
            let priority = 0;
            // if priority given and is a number update priority
            if (args[0])
                priority = parseInt(args[0]);
            if (regex.test(program) && !isNaN(priority)){ // load program
                // Load the program to memory 
                _MemoryManager.loadToMemory(codeList)

            }else{
                _StdOut.putText("Invalid hex Program or priority id number..");
                return;
            }

        }

        public shellRun(args: string[]){

            // check for valid arguments
            if(args[0]){
                var id = args[0];
                if(!isNaN(parseInt(id))){
                    // if pcb is in pcb list then execute program
                    if(_MemoryManager.isValidPCB(id)){
                        _Scheduler.loadToScheduler(id);
                        _StdOut.putText("Running PID: " + id);
                        return;
                    }
                    _StdOut.putText("Invalid program id.");
                }
            }
            else{
                _StdOut.putText("Input a process id - run <PID>");
            }
        }

        public shellStatus(args: string[]){
            if (args[0]){
                _Status = args[0];
            }
            else{
                _StdOut.putText("Please enter a status message.");
            }
        }

        public shellClearMem(args: string[]){
            _MemoryManager.clearMemory();
        }

        public shellRunAll(args: string[]){
            for (var i = 0; i < _ResidentList.length;i++){
                if(_ResidentList[i].state == "Resident"){
                    _CPU.isExecuting = true;
                    _Scheduler.loadToScheduler(_ResidentList[i].pid);
                }          
            }
        }

        public shellPs(args: string[]){
            for (var i = 0; i < _ResidentList.length;i++){
                _StdOut.putText("PID " + _ResidentList[i].pid + ": " + _ResidentList[i].state);
                _StdOut.advanceLine();

            }
        }

        public shellKill(args: string[]){
            if (args[0] && _MemoryManager.isValidPCB(args[0])){
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_IRQ,args));
            }
            else{
                _StdOut.putText("Please enter a valid PID.");
            }
        }

        public shellKillAll(args: string[]){
            for (var i = 0; i < _ResidentList.length; i++){
              
                    _OsShell.shellKill(_ResidentList[i].pid);
            }
        }

        public shellQuantum(args: string[]){
            if (args[0] && !isNaN(parseInt(args[0]))){
                _Quantum = Math.round(parseInt(args[0]));
                _StdOut.putText("Quantum set to: " + _Quantum);
            }
            else{
                _StdOut.putText("Error: please input a integer for quantum value.");
            }
            
            
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the current version of the OS.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but continues operating on the lower level.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears screen.");
                        break;
                    case "trace":
                        _StdOut.putText("Trace on/off starts and stops the host log from logging system calls.");
                        break;
                    case "rot13":
                        _StdOut.putText("Performs rot13 operation on given string argument and encrypts string.");
                        break;
                    case "prompt":
                        _StdOut.putText("Changes prompt symbol to specified argument given by user.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Displays where you are. Kinda.");
                        break;
                    case "fortune":
                        _StdOut.putText("hmmmmm..");
                        break; 
                    case "load":
                        _StdOut.putText("Loads the program given by the user from program input");
                        break;
                    case "bsod":
                        _StdOut.putText("Sends an error through the kernel.");
                        break;
                    case "run":
                        _StdOut.putText("Runs the program specified by the PID argument given.");
                        break;
                    case "runAll":
                        _StdOut.putText("Runs all processes loaded in memory.");
                        break;
                    case "clearmem":
                        _StdOut.putText("Clears all memory partions for new program input.");
                        break;
                    case "kill":
                        _StdOut.putText("Kills the process specified by the process ID.");
                        break;
                    case "killall":
                        _StdOut.putText("Kills all running processes.");
                        break;
                    case "ps":
                        _StdOut.putText("Displays the PID and state of all processes.");
                        break;
                    case "quantum":
                        _StdOut.putText("Sets the current quantum for round robin scheduling based of the integer parameter.");
                        break;
                    case "status":
                        _StdOut.putText("Sets the status of the OS");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

    }
}
