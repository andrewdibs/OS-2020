var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.segmentStatus = [true, true, true];
        }
        MemoryManager.prototype.loadToMemory = function (program, priority) {
            // find open segment
            for (var i = 0; i < this.segmentStatus.length; i++) {
                if (this.segmentStatus[i]) {
                    var base = i * _SegmentSize;
                    var limit = base + _SegmentSize;
                    // assign program to proper memory segment
                    for (var j = base; j < program.length + base; j++) {
                        _Memory.locations[j] = program[j - base];
                    }
                    // set segment to false since it is now taken
                    this.segmentStatus[i] = false;
                    // Create PCB and add to PCB list 
                    var currentProcess = new TSOS.ProcessControlBlock();
                    currentProcess.pid = _CurrentPID;
                    currentProcess.base = base;
                    currentProcess.limit = limit;
                    currentProcess.state = "Resident";
                    currentProcess.priority = priority;
                    _ResidentList.push(currentProcess);
                    _StdOut.putText("Program loaded successfully. PID: " + _CurrentPID);
                    _CurrentPID++;
                    return;
                }
            }
            // store program to disk 
            // Create PCB and add to PCB list 
            var currentProcess = new TSOS.ProcessControlBlock();
            currentProcess.pid = _CurrentPID++;
            currentProcess.base = -0;
            currentProcess.limit = -0;
            currentProcess.state = "Resident";
            currentProcess.location = "Disk";
            currentProcess.priority = priority;
            var data = "";
            for (var i = 0; i < program.length; i++) {
                data += program[i];
            }
            _DeviceDriverFileSystem.create(".swap" + currentProcess.pid);
            _DeviceDriverFileSystem.write(".swap" + currentProcess.pid, data);
            //unfortunaltly this breaks scheduling 
            // _ResidentList.push(currentProcess);
        };
        MemoryManager.prototype.isValidPCB = function (pid) {
            for (var _i = 0, _ResidentList_1 = _ResidentList; _i < _ResidentList_1.length; _i++) {
                var pcb = _ResidentList_1[_i];
                if (pcb.pid == pid)
                    return true;
            }
            return false;
        };
        MemoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < _Memory.locations.length; i++) {
                _Memory.locations[i] = "00";
            }
            this.segmentStatus = [true, true, true];
        };
        MemoryManager.prototype.clearSegment = function (index) {
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
