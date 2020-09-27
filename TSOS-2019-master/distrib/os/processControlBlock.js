var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(pid, PC, Xreg, Yreg, base, limit, Zflag, Acc, IR) {
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (IR === void 0) { IR = ""; }
            this.pid = pid;
            this.PC = PC;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.base = base;
            this.limit = limit;
            this.Zflag = Zflag;
            this.Acc = Acc;
            this.IR = IR;
        }
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
