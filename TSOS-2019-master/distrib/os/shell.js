/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDateTime, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Lets you know where you are.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // BSOD
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- triggers a kernel trap error.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // fortune
            sc = new TSOS.ShellCommand(this.shellFortune, "fortune", "- Tells you a fortune.");
            this.commandList[this.commandList.length] = sc;
            // status <string> - sets the status to the specified string
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - sets the status to the specified string");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads the program in Program input.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Runs the program assigned to the given PID.");
            this.commandList[this.commandList.length] = sc;
            // runall 
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all running processes.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- List the running processes and their IDs");
            this.commandList[this.commandList.length] = sc;
            // killall- kills all running processes.
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- Kills all running processes.");
            this.commandList[this.commandList.length] = sc;
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<id> - Kill the specified process id");
            this.commandList[this.commandList.length] = sc;
            // clearmem - clears all memory partions
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all memory partions.");
            this.commandList[this.commandList.length] = sc;
            // quanum <int> - sets the quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets quantum to specified integer.");
            this.commandList[this.commandList.length] = sc;
            // create <filename> - creates a new file
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Creates the specified filename.");
            this.commandList[this.commandList.length] = sc;
            // write <filename> <"string">- Writes data string to specified file name 
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> <data> - Creates the specified filename.");
            this.commandList[this.commandList.length] = sc;
            // read <filename> - reads the requested file name 
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Reads the specified filename.");
            this.commandList[this.commandList.length] = sc;
            // delete <filename> - deletes the requested file name 
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Deletes the specified filename.");
            this.commandList[this.commandList.length] = sc;
            // format - formats the disk drive
            sc = new TSOS.ShellCommand(this.shellFormat, "format", " - Formats the disk.");
            this.commandList[this.commandList.length] = sc;
            // ls - lists files on disk
            sc = new TSOS.ShellCommand(this.shellLs, "ls", " - Lists files on disk.");
            this.commandList[this.commandList.length] = sc;
            // setschedule <[rr, fcfs, priority]>- sets scheduling algorithm 
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "<[rr, fcfs, priority]> - Sets scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // getschedule - sets scheduling algorithm 
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Gets the current scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
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
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText("dibsOS version " + "0.1");
        };
        Shell.prototype.shellDateTime = function (args) {
            var date = new Date();
            _StdOut.putText(date);
        };
        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("lost");
        };
        Shell.prototype.shellBSOD = function (args) {
            _StdOut.putText("Kernel Trap Error!");
            _Kernel.krnTrapError("BSOD AHHH");
        };
        Shell.prototype.shellFortune = function (args) {
            _StdOut.putText("you are not illiterate.. :)");
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellLoad = function (args) {
            var program = _ProgramInputBox.value;
            // remove white space
            var codeList = program.toUpperCase().split(" ");
            program = program.toUpperCase().replace(/\s/g, "");
            // validate only hex Symbols
            var regex = /^[0-9A-Fa-f]+$/;
            // set default priority to 16/32
            var priority = 16;
            // if priority given and is a number update priority
            if (args[0])
                priority = parseInt(args[0]);
            if (regex.test(program) && !isNaN(priority)) { // load program
                // Load the program to memory
                _MemoryManager.loadToMemory(codeList, priority);
            }
            else {
                _StdOut.putText("Invalid hex Program or priority id number..");
                return;
            }
        };
        Shell.prototype.shellRun = function (args) {
            // check for valid arguments
            if (args[0]) {
                var id = args[0];
                if (!isNaN(parseInt(id))) {
                    // if pcb is in pcb list then execute program
                    if (_MemoryManager.isValidPCB(id)) {
                        _Scheduler.loadToScheduler(id);
                        _StdOut.putText("Running PID: " + id);
                        return;
                    }
                    _StdOut.putText("Invalid program id.");
                }
            }
            else {
                _StdOut.putText("Input a process id - run <PID>");
            }
        };
        Shell.prototype.shellStatus = function (args) {
            if (args[0]) {
                _Status = args[0];
            }
            else {
                _StdOut.putText("Please enter a status message.");
            }
        };
        Shell.prototype.shellClearMem = function (args) {
            _MemoryManager.clearMemory();
        };
        Shell.prototype.shellRunAll = function (args) {
            _Scheduler.runAll();
        };
        Shell.prototype.shellPs = function (args) {
            for (var i = 0; i < _ResidentList.length; i++) {
                _StdOut.putText("PID " + _ResidentList[i].pid + ": " + _ResidentList[i].state);
                _StdOut.advanceLine();
            }
        };
        Shell.prototype.shellKill = function (args) {
            if (args[0] && _MemoryManager.isValidPCB(args[0])) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_IRQ, args));
            }
            else {
                _StdOut.putText("Please enter a valid PID.");
            }
        };
        Shell.prototype.shellKillAll = function () {
            for (var i = 0; i < _ResidentList.length; i++) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_IRQ, [i]));
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            if (args[0] && !isNaN(parseInt(args[0]))) {
                _RequestedQuantum = Math.round(parseInt(args[0]));
                _StdOut.putText("Quantum set to: " + _RequestedQuantum);
            }
            else {
                _StdOut.putText("Error: please input a integer for quantum value.");
            }
        };
        Shell.prototype.shellCreate = function (args) {
            var name = args[0];
            if (name) {
                if (name.charAt(0) == ".") {
                    _StdOut.putText("Please start file name with a letter.");
                    return;
                }
                _DeviceDriverFileSystem.create(name);
                _StdOut.putText("Created directory file on disk sucessfully.");
            }
            else {
                _StdOut.putText("Please Provide a file name.");
            }
        };
        Shell.prototype.shellRead = function (args) {
            if (args[0]) {
                _DeviceDriverFileSystem.read(args[0]);
            }
            else {
                _StdOut.putText("Please enter a file name.");
            }
        };
        Shell.prototype.shellWrite = function (args) {
            if (args[0] && args[1]) {
                var file = args[0];
                var content = args[1];
                if (content.charAt(0) == '"' && content.charAt(content.length - 1) == '"') {
                    _DeviceDriverFileSystem.write(file, content);
                }
                else {
                    _StdOut.putText("Please surround data in quotes.");
                }
            }
            else {
                _StdOut.putText("Please provide a valid file name and data surrounded in quotes.");
            }
        };
        Shell.prototype.shellDelete = function (args) {
            if (args[0]) {
                _DeviceDriverFileSystem["delete"](args[0]);
                _StdOut.putText("Deleted " + args[0] + ". ");
            }
            else {
                _StdOut.putText("Please enter a filename to delete.");
            }
        };
        Shell.prototype.shellFormat = function () {
            if (_CPU.isExecuting) {
                _StdOut.putText("Unable to format disk while CPU is executing please wait..");
            }
            else {
                _DeviceDriverFileSystem.format();
                _StdOut.putText("Disk Formatted succesfully.");
            }
        };
        Shell.prototype.shellSetSchedule = function (args) {
            if (args[0]) {
                _Scheduler.setSchedule(args[0]);
            }
            else {
                _StdOut.putText("Error: please input a scheduling algorithm [rr, fcfs, priority].");
            }
        };
        Shell.prototype.shellGetSchedule = function () {
            _StdOut.putText("Current scheduling algorithm: " + _Scheduler.currentSchedule);
        };
        Shell.prototype.shellLs = function (args) {
            _DeviceDriverFileSystem.ls();
        };
        Shell.prototype.shellMan = function (args) {
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
                    case "create":
                        _StdOut.putText("Create the filename provided on disk.");
                        break;
                    case "read":
                        _StdOut.putText("Displays the contents of filename provided.");
                        break;
                    case "write":
                        _StdOut.putText("Writes string to the provided filename.");
                        break;
                    case "delete":
                        _StdOut.putText("Deletes the filename provided in arguments.");
                        break;
                    case "format":
                        _StdOut.putText("Initilizes all blocks in all sectors in all tracks.");
                        break;
                    case "ls":
                        _StdOut.putText("Lists all files currently on disc.");
                        break;
                    case "setschedule":
                        _StdOut.putText("Sets the schedule algorithm [rr, fcfs, priority].");
                        break;
                    case "getschedule":
                        _StdOut.putText("Displays the current scheduling algorithm.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
