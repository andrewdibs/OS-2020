var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(readyQueue) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            this.readyQueue = readyQueue;
        }
        Scheduler.prototype.loadToCPU = function (process) {
            if (!this.readyQueue.isEmpty()) {
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
            process.state = "terminated";
            console.log(process.state);
            console.log(_ResidentList[0].state);
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
