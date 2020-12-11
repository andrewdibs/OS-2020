var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(pid, PC, Xreg, Yreg, base, limit, Zflag, Acc, priority, IR, state, location) {
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (priority === void 0) { priority = 0; }
            if (IR === void 0) { IR = ""; }
            if (state === void 0) { state = "Ready"; }
            if (location === void 0) { location = "Memory"; }
            this.pid = pid;
            this.PC = PC;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.base = base;
            this.limit = limit;
            this.Zflag = Zflag;
            this.Acc = Acc;
            this.priority = priority;
            this.IR = IR;
            this.state = state;
            this.location = location;
        }
        ProcessControlBlock.prototype.init = function () {
            this.pid = 0;
            this.PC = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.base = 0;
            this.limit = 0;
            this.Zflag = 0;
            this.Acc = 0;
            this.priority = 0;
            this.IR = "";
            this.state = "Ready";
            this.location = "Memory";
        };
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
