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
            // find open directory 
            var tsb = this.getOpenDirectory();
            // if there is an open directory insert filename
            if (tsb) {
                // convert filename to hex
                var hex = "";
                for (var i = 0; i < filename.length; i++) {
                    hex += filename.charCodeAt(i).toString(16).toUpperCase().padStart(2, "0");
                }
                console.log(hex);
                var key = tsb.replace(new RegExp(":", "g"), "");
                var data = "1" + key + hex;
                var array = this.formatTSB(data);
                console.log(array.toString());
                sessionStorage.setItem(tsb, array.join());
                TSOS.Utils.updateDisk();
            }
            else {
                _StdOut.putText("No open directories.");
            }
        };
        DeviceDriverFileSystem.prototype.read = function (filename) {
        };
        DeviceDriverFileSystem.prototype.write = function (filename, data) {
        };
        DeviceDriverFileSystem.prototype["delete"] = function (filename) {
        };
        DeviceDriverFileSystem.prototype.ls = function () {
        };
        DeviceDriverFileSystem.prototype.format = function () {
            var block = new Array(64);
            // pad start for disk
            for (var i = 0; i < block.length; i++) {
                i < 4 ? block[i] = "0" : block[i] = "00";
            }
            // join into a single string to assign tsb
            var data = block.join();
            console.log(data);
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
        DeviceDriverFileSystem.prototype.getOpenDirectory = function () {
            // find open directory 
            for (var s = 0; s < SECTORS; s++) {
                for (var b = 0; b < BLOCKS; b++) {
                    if (s != 0 || b != 0) {
                        var data = sessionStorage.getItem("0:" + s + ":" + b);
                        if (data.charAt(0) == "0") {
                            return "0:" + s + ":" + b;
                        }
                    }
                }
            }
            return null;
        };
        DeviceDriverFileSystem.prototype.formatTSB = function (data) {
            var tsb = new Array(64);
            var index = 0;
            for (var i = 0; i < data.length - 1; i++) {
                if (i < 4) {
                    tsb[index++] = data.charAt(i);
                }
                else {
                    var t = i;
                    tsb[index++] = data.substring(i, i + 2);
                    i++;
                }
            }
            for (var j = 0; j < tsb.length; j++) {
                if (tsb[j] == null) {
                    tsb[j] = "00";
                }
            }
            return tsb;
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
