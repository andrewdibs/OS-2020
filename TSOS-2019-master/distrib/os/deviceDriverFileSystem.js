var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = /** @class */ (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem(formatted) {
            if (formatted === void 0) { formatted = false; }
            var _this = _super.call(this) || this;
            _this.formatted = formatted;
            return _this;
        }
        DeviceDriverFileSystem.prototype.create = function (filename) {
        };
        DeviceDriverFileSystem.prototype.read = function (filename) {
        };
        DeviceDriverFileSystem.prototype.write = function (filename, data) {
        };
        DeviceDriverFileSystem.prototype["delete"] = function (filename) {
        };
        DeviceDriverFileSystem.prototype.format = function () {
            console.log("hit");
            var block = new Array(60);
            // pad start for disk
            for (var i = 0; i < block.length; i++) {
                i < 4 ? block[i] = "0" : block[i] = "00";
            }
            // join into a single string to assign tsb
            var data = block.join();
            // finally format disk 
            for (var t = 0; t < TRACKS; t++) {
                for (var s = 0; s < SECTORS; s++) {
                    for (var b = 0; b < BLOCKS; b++) {
                        sessionStorage.setItem(t + ":" + s + ":" + b, data);
                    }
                }
            }
            // update the display 
            TSOS.Utils.updateDisk();
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
