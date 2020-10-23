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
        MemoryManager.prototype.getLocation = function (address) {
            return _Memory.locations[address];
        };
        MemoryManager.prototype.writeByte = function (address, value) {
            if (value.length === 1)
                value = "0" + value;
            _Memory.locations[address] = value;
        };
        MemoryManager.prototype.read = function (address) {
            return _Memory.locations[address];
        };
        MemoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < _Memory.locations.length; i++) {
                _Memory.locations[i] = "00";
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
