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
            for (var i = 0; i < program.length; i++) {
                _Memory.locations[i] = program[i];
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
