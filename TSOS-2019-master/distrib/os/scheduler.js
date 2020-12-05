var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(readyQueue, rrCounter) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (rrCounter === void 0) { rrCounter = 0; }
            this.readyQueue = readyQueue;
            this.rrCounter = rrCounter;
        }
        Scheduler.prototype.loadToCPU = function (process) {
            if (!this.readyQueue.isEmpty()) {
                _CPU.curPid = process.pid;
                _CPU.PC = process.PC;
                _CPU.Acc = process.Acc;
                _CPU.IR = process.IR;
                _CPU.Xreg = process.Xreg;
                _CPU.Yreg = process.Yreg;
                _CPU.Zflag = process.Zflag;
                _CPU.base = process.base;
                _CPU.limit = process.limit;
                _CPU.isExecuting = true;
                console.log(_CPU.base);
            }
        };
        Scheduler.prototype.contextSwitch = function (id) {
            var nextID = this.readyQueue.peek();
            var curProcess = this.getProcess(nextID);
            if (curProcess !== null) {
                if (curProcess.state === "Ready") {
                    this.rrCounter = 0;
                    curProcess.state = "Running";
                }
                if (id === -1) {
                    console.log("start executing");
                }
                this.loadToCPU(curProcess);
            }
            else {
                _CPU.isExecuting = false;
            }
        };
        Scheduler.prototype.loadToScheduler = function (process) {
            // load process id to ready queue
            this.readyQueue.enqueue(process);
        };
        Scheduler.prototype.makeDecision = function () {
            if (_CPU.isExecuting) {
                this.roundRobin();
            }
            else {
                if (!this.readyQueue.isEmpty()) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXECUTE_IRQ, [-1]));
                }
            }
        };
        Scheduler.prototype.roundRobin = function () {
            console.log(this.rrCounter);
            this.rrCounter++;
            var curProcess = -1;
            if (_Quantum < this.rrCounter + 1) {
                this.rrCounter = 0;
                if (!this.readyQueue.isEmpty()) {
                    if (this.readyQueue.getSize() > 1) {
                        curProcess = this.readyQueue.dequeue();
                        this.loadToScheduler(curProcess);
                    }
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SWITCH_IRQ, [curProcess]));
                }
            }
        };
        Scheduler.prototype.getProcess = function (pid) {
            // if pid is in resident list return process
            for (var i = 0; i < _ResidentList.length; i++) {
                if (pid == _ResidentList[i].pid) {
                    return _ResidentList[i];
                }
            }
            // else 
            return null;
        };
        Scheduler.prototype.terminate = function (pid) {
            var process = this.getProcess(pid);
            process.state = "Terminated";
            this.readyQueue.dequeue();
            _CPU.isExecuting = false;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
