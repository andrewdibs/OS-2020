var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(readyQueue, currentSchedule, rrCounter) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (currentSchedule === void 0) { currentSchedule = "rr"; }
            if (rrCounter === void 0) { rrCounter = 0; }
            this.readyQueue = readyQueue;
            this.currentSchedule = currentSchedule;
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
            var nextID = this.readyQueue.peek();
            var curProcess = this.getProcess(nextID);
            if (curProcess)
                if (curProcess.state == "Terminated") {
                    this.readyQueue.dequeue();
                    return;
                }
            if (curProcess !== null) {
                if (curProcess.state === "Ready") {
                    this.rrCounter = 0;
                    curProcess.state = "Running";
                }
                this.loadToCPU(curProcess);
            }
            else {
                _CPU.isExecuting = false;
            }
        };
        Scheduler.prototype.loadToScheduler = function (process) {
            // load process id to ready queue
            console.log(process);
            this.readyQueue.enqueue(process);
        };
        Scheduler.prototype.makeDecision = function () {
            if (_CPU.isExecuting) {
                // round robin and fcfs
                if (this.currentSchedule == "rr" || this.currentSchedule == "fcfs") {
                    if (this.currentSchedule == "fcfs") {
                        _Quantum = Number.MAX_VALUE;
                    }
                    else {
                        _Quantum = _RequestedQuantum;
                    }
                    this.roundRobin();
                }
                // priority 
                else {
                    this.priority();
                }
            }
            else {
                if (!this.readyQueue.isEmpty()) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXECUTE_IRQ, [-1]));
                }
            }
            TSOS.Utils.updatePCBgui();
        };
        Scheduler.prototype.roundRobin = function () {
            console.log(this.rrCounter);
            var curProcess = -1;
            if (_Quantum < this.rrCounter) {
                this.rrCounter = 0;
                if (!this.readyQueue.isEmpty()) {
                    if (this.readyQueue.getSize() > 1) {
                        curProcess = this.readyQueue.dequeue();
                        this.loadToScheduler(curProcess);
                    }
                    // change the state of the process back to ready
                    if (curProcess > -1) {
                        var next = this.getProcess(curProcess);
                        next.state = "Ready";
                    }
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SWITCH_IRQ, [curProcess]));
                }
            }
            this.rrCounter++;
        };
        Scheduler.prototype.priority = function () {
            // sort the Resident list by priority
            _ResidentList = _ResidentList.sort(function (a, b) { return a.priority - b.priority; });
            this.readyQueue.dequeue();
            _Quantum = Number.MAX_VALUE;
            this.roundRobin();
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
        Scheduler.prototype.setSchedule = function (algorithm) {
            switch (algorithm) {
                case "rr":
                    this.currentSchedule = "rr";
                    break;
                case "fcfs":
                    this.currentSchedule = "fcfs";
                    break;
                case "priority":
                    this.currentSchedule = "priority";
                    break;
                default:
                    _StdOut.putText("Not valid scheduling algorithm. please specify either [rr, fcfs, priority].");
                    break;
            }
        };
        Scheduler.prototype.runAll = function () {
            if (this.currentSchedule == "priority") {
                this.priority();
            }
            for (var i = 0; i < _ResidentList.length; i++) {
                if (_ResidentList[i].state == "Resident") {
                    _CPU.isExecuting = true;
                    _ResidentList[i].state = "Ready";
                    _Scheduler.loadToScheduler(_ResidentList[i].pid);
                }
            }
        };
        Scheduler.prototype.terminate = function (pid) {
            var process = this.getProcess(pid);
            process.state = "Terminated";
            _CPU.isExecuting = false;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
