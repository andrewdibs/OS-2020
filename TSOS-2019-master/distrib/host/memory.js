var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(locations) {
            if (locations === void 0) { locations = new Array(_MemorySize); }
            this.locations = locations;
        }
        // initialize memory to 0s
        Memory.prototype.init = function () {
            for (var i = 0; i < this.locations.length; i++) {
                this.locations[i] = "00";
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
