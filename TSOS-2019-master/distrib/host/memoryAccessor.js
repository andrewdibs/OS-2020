var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.read = function (base, address) {
            var physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0) {
                // error return
                // TODO: 
                console.log(" out of bounds error");
                // terminate process
                return;
            }
            return _Memory.locations[physical];
        };
        MemoryAccessor.prototype.getLocation = function (base, address) {
            var physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0) {
                // error return
                console.log(" out of bounds error");
                // terminate process
                return;
            }
            return _Memory.locations[physical];
        };
        MemoryAccessor.prototype.writeByte = function (base, address, value) {
            // pad the hex value for single digit 
            if (value.length === 1)
                value = "0" + value;
            var physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0) {
                // error return
                // terminate process
                return;
            }
            _Memory.locations[physical] = value;
            return;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
