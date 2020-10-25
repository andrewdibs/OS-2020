var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler(readyQueue) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue; }
        }
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
