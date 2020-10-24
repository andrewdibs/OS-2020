var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.segmentStatus = [true, true, true];
        }
        MemoryManager.prototype.loadToMemory = function (program) {
            // find open segment
            for (var i = 0; i < this.segmentStatus.length; i++) {
                if (this.segmentStatus[i]) {
                    var base = i * _SegmentSize;
                    var limit = base + _SegmentSize;
                    console.log("base : " + base);
                    for (var j = base; j < program.length + base; j++) {
                        _Memory.locations[j] = program[j - base];
                        console.log(j);
                    }
                    this.segmentStatus[i] = false;
                    return;
                }
            }
            // else no memory segments available
            _StdOut.putText("No memory segments available for use. Please clear memory using clearmem command.");
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
