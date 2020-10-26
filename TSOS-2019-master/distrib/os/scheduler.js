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
            }
        };
        Scheduler.prototype.contextSwitch = function (id) {
            var curProcess = this.getProcess(id);
            if (curProcess.state === "Ready") {
                this.rrCounter = 0;
                curProcess.state = "Running";
                this.loadToCPU(curProcess);
            }
        };
        Scheduler.prototype.loadToScheduler = function (process) {
            // load process id to ready queue
            this.readyQueue.enqueue(process);
        };
        Scheduler.prototype.getProcess = function (pid) {
            // if pid is in resident list return process
            for (var i = 0; i < _ResidentList.length; i++) {
                if (pid === _ResidentList[i].pid) {
                    console.log(_ResidentList[i].pid);
                    return _ResidentList[i];
                }
            }
            // else 
            return null;
        };
        Scheduler.prototype.terminate = function (pid) {
            var process = this.getProcess(pid);
            process.state = "Terminated";
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
