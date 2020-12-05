/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting, curPid, base, limit) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = ""; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (curPid === void 0) { curPid = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.curPid = curPid;
            this.base = base;
            this.limit = limit;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = 0;
            this.limit = 0;
            this.curPid = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // get next op code based off the PC counter
            var command = _Memory.locations[this.base + this.PC];
            this.IR = command;
            TSOS.Utils.updateCPUgui();
            this.executeOpCode(command);
            var pcb = _Scheduler.getProcess(this.curPid);
            // store information back to the current pcb
            pcb.PC = this.PC;
            pcb.IR = this.IR;
            pcb.Acc = this.Acc;
            pcb.Xreg = this.Xreg;
            pcb.Yreg = this.Yreg;
            pcb.Zflag = this.Zflag;
        };
        Cpu.prototype.executeOpCode = function (command) {
            switch (command) {
                case "A9":
                    this.PC++;
                    this.Acc = parseInt(_Memory.locations[this.base + this.PC++], 16);
                    break;
                case "AD":
                    this.loadAcc();
                    break;
                case "8D":
                    this.storeAcc();
                    break;
                case "6D":
                    this.addWithCarry();
                    break;
                case "A2":
                    //  loads the x register with constant
                    this.loadXregConst();
                    break;
                case "AE":
                    // load x register with value from memory
                    this.loadXregMemory();
                    break;
                case "A0":
                    // load y register with constant 
                    this.loadYregConst();
                    break;
                case "AC":
                    // loads y register with value from memory
                    this.loadYregMemory();
                    break;
                case "EA":
                    // do nothing
                    this.PC++;
                    break;
                case "00":
                    // break
                    this.finish();
                    break;
                case "EC":
                    // compare x reg with memory value and if equal : set zflag to 1
                    this.compareXtoMemory();
                    break;
                case "D0":
                    //branch if zflag is currently 0 
                    this.branch();
                    break;
                case "EE":
                    // increment
                    this.increment();
                    break;
                case "FF":
                    // system call 
                    this.systemCall();
                    break;
                default:
                    console.log("invalid op codes");
            }
        };
        // A9
        Cpu.prototype.loadAcc = function () {
            // load the accumulator with data from memory address
            this.PC++;
            var location = parseInt(_MemoryAccessor.read(this.base, this.PC + 1).toString() + _MemoryAccessor.read(this.base, this.PC++).toString(), 16);
            this.Acc = parseInt(_MemoryAccessor.read(this.base, location).toString(), 16);
            this.PC++;
        };
        //AD
        Cpu.prototype.storeAcc = function () {
            this.PC++;
            // find sta address and write acc to that location
            var location = parseInt(_MemoryAccessor.getLocation(this.base, this.PC).toString(), 16);
            _MemoryAccessor.writeByte(this.base, location, this.Acc.toString(16).toUpperCase());
            this.PC += 2;
        };
        // 6D // hmmm not sure if this is working correctly
        Cpu.prototype.addWithCarry = function () {
            // get value of next bytes location and add to the accumulator 
            this.PC++;
            // read next two bytes
            var location = this.getAddress();
            // add to accumulator
            this.Acc += parseInt(_MemoryAccessor.read(this.base, location).toString(), 16);
            this.PC += 2;
        };
        // A2
        Cpu.prototype.loadXregConst = function () {
            this.PC++;
            this.Xreg = parseInt(_MemoryAccessor.read(this.base, this.PC++).toString(), 16);
        };
        // AE
        Cpu.prototype.loadXregMemory = function () {
            this.PC++;
            var location = this.getAddress();
            this.Xreg = parseInt(_MemoryAccessor.read(this.base, location).toString(), 16);
            this.PC += 2;
        };
        // A0
        Cpu.prototype.loadYregConst = function () {
            this.PC++;
            this.Yreg = parseInt(_MemoryAccessor.read(this.base, this.PC++).toString(), 16);
        };
        // AC
        Cpu.prototype.loadYregMemory = function () {
            this.PC++;
            var location = this.getAddress();
            this.Yreg = parseInt(_MemoryAccessor.read(this.base, location).toString(), 16);
            this.PC += 2;
        };
        // EC
        Cpu.prototype.compareXtoMemory = function () {
            this.PC++;
            var location = this.getAddress();
            if (parseInt(_MemoryAccessor.read(this.base, location).toString(), 16) === this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            this.PC += 2;
        };
        // D0
        Cpu.prototype.branch = function () {
            this.PC++;
            if (this.Zflag === 0) {
                this.PC += parseInt(_MemoryAccessor.read(this.base, this.PC).toString(), 16);
                this.PC++;
                if (this.PC > 256)
                    this.PC %= 256;
            }
            else {
                this.PC++;
            }
        };
        // EE
        Cpu.prototype.increment = function () {
            this.PC++;
            var location = this.getAddress();
            _MemoryAccessor.writeByte(this.base, location, parseInt(_MemoryAccessor.read(this.base, location).toString(), 16) + 1);
            this.PC += 2;
        };
        // FF 
        Cpu.prototype.systemCall = function () {
            // if the x register = 1 print y register integer
            var params = [];
            if (this.Xreg === 1) {
                params.push(this.Yreg.toString());
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL, params));
            }
            if (this.Xreg === 2) {
                var result = "";
                for (var i = 0; i + this.Yreg < _Memory.locations.length; i++) {
                    var location = _Memory.locations[this.base + this.Yreg + i];
                    if (location == "00") {
                        break;
                    }
                    else {
                        result += String.fromCharCode(parseInt(location, 16));
                    }
                }
                params.push(result);
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL, params));
            }
            this.PC++;
        };
        // 00
        Cpu.prototype.finish = function () {
            var params = [];
            params.push(this.curPid);
            console.log("00");
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXECUTED_IRQ, params));
            this.isExecuting = false;
        };
        Cpu.prototype.getAddress = function () {
            return parseInt(_MemoryAccessor.read(this.base, this.PC + 1).toString() + _MemoryAccessor.read(this.base, this.PC).toString(), 16);
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
