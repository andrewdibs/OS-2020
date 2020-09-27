var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.createProcess = function (pid, codeList) {
            // check for available space
            var pcb = new TSOS.ProcessControlBlock();
            pcb.pid = pid;
        };
        MemoryManager.prototype.loadToMemory = function (program) {
            for (var i_1 = 0; i_1 < program.length; i_1++) {
                _Memory.locations[i_1] = program[i_1];
            }
            for (var i = 0; _Memory.locations.length; i++) {
                console.log(_Memory.locations[i]);
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
