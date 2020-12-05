module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue(),
                  public rrCounter = 0) {
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

          console.log(_CPU.base);

        }
      }

      public contextSwitch(id){
        var nextID = this.readyQueue.peek();   
        var curProcess = this.getProcess(nextID);
        
        if (curProcess !== null){
          if (curProcess.state === "Ready"){
            this.rrCounter = 0;
            console.log("hello");
            curProcess.state = "Running";
            //TSOS.Utils.updatePCBgui();
          }
          this.loadToCPU(curProcess);
        }
        else{
          _CPU.isExecuting = false;
        }
        
        
      }

      public loadToScheduler(process): void{
        // load process id to ready queue
        this.readyQueue.enqueue(process);
        
      }

      public makeDecision(){
        if (_CPU.isExecuting){
          this.roundRobin();
        }else{
          if (!this.readyQueue.isEmpty()){
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXECUTE_IRQ, [-1]));
          }
        }
        TSOS.Utils.updatePCBgui();
      }

      public roundRobin(){
        console.log(this.rrCounter);
         
        var curProcess = -1;
        if (_Quantum < this.rrCounter){
          this.rrCounter = 0;
          if (!this.readyQueue.isEmpty()){
            if (this.readyQueue.getSize() > 1){
              curProcess = this.readyQueue.dequeue();
              this.loadToScheduler(curProcess);
            }
            // change the state of the process back to ready
            if(curProcess > -1 ){
              var next = this.getProcess(curProcess);
              next.state = "Ready";
            }
            
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SWITCH_IRQ, [curProcess]));
            
          }
        }
        this.rrCounter++;
      }

      public getProcess(pid){
        // if pid is in resident list return process
        for (var i = 0; i < _ResidentList.length;i++){
          if (pid == _ResidentList[i].pid){
            return _ResidentList[i];
          }
        }
        // else 
        return null;
      }

      public terminate(pid){
        var process = this.getProcess(pid);
        process.state = "Terminated";
        this.readyQueue.dequeue();
        _CPU.isExecuting = false;

      }

      
  }
}