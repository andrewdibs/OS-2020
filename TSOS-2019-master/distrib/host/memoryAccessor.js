var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.read = function (address) {
            return _Memory.locations[address];
        };
        MemoryAccessor.prototype.getLocation = function (address) {
            return _Memory.locations[address];
        };
        MemoryAccessor.prototype.writeByte = function (address, value) {
            if (value.length === 1)
                value = "0" + value;
            _Memory.locations[address] = value;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
