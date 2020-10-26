var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(readyQueue) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            this.readyQueue = readyQueue;
        }
        Scheduler.prototype.loadToCPU = function () {
            if (!this.readyQueue.isEmpty()) {
            }
        };
        Scheduler.prototype.loadToScheduler = function (process) {
            this.readyQueue.enqueue(process);
            console.log("proccess id : " + process);
            console.log("ready queue: " + this.readyQueue.toString());
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
