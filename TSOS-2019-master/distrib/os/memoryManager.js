var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadToMemory = function (program) {
            for (var i = 0; i < program.length; i++) {
                _Memory.locations[i] = program[i];
            }
        };
        MemoryManager.prototype.isValidPCB = function (pid) {
            for (var _i = 0, _PCB_1 = _PCB; _i < _PCB_1.length; _i++) {
                var pcb = _PCB_1[_i];
                if (pcb.pid == pid)
                    return true;
            }
            return false;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
