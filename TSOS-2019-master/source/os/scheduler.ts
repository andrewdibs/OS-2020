module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue()
                  
                  ) {
      }

       

      public loadToCPU(process){
        if (!this.readyQueue.isEmpty()){
          _CPU.curPid = process.pid;
          _CPU.PC = process.PC; 
          _CPU.Acc = process.Acc;
          _CPU.IR = process.IR;
          _CPU.Xreg = process.Xreg;
          _CPU.Yreg = process.Yreg;
          _CPU.Zflag = process.Zflag;
          _CPU.base = process.base;
          _CPU.limit = process.limit;
          _CPU.isExecuting = true;

        }
      }

      public loadToScheduler(process): void{
        // load process id to ready queue
        this.readyQueue.enqueue(process);
      }

      public getProcess(pid){
        // if pid is in resident list return process
        for (var i = 0; i < _ResidentList.length;i++){
          if (pid === _ResidentList[i].pid){
            console.log(_ResidentList[i].pid);
            return _ResidentList[i];
          }
        }
        // else 
        return null;
      }

      public terminate(pid){
        var process = this.getProcess(pid);
        process.state = "terminated";

      }

      
  }
}