module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue(),
                  public currentSchedule = "rr",
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

        }
      }

      public contextSwitch(id){
        var nextID = this.readyQueue.peek();   
        var curProcess = this.getProcess(nextID);
        if (curProcess)
          if (curProcess.state == "Terminated"){
            this.readyQueue.dequeue();
            return;
          }
        
        if (curProcess !== null){
          if (curProcess.state === "Ready"){
            this.rrCounter = 0;
            curProcess.state = "Running";
          }
          this.loadToCPU(curProcess);
        }
        else{
          _CPU.isExecuting = false;
        }   
      }

      public loadToScheduler(process): void{
        // load process id to ready queue
        console.log(process);
        this.readyQueue.enqueue(process);
        
      }

      public makeDecision(){
        if (_CPU.isExecuting){
          // round robin and fcfs
          if (this.currentSchedule == "rr" || this.currentSchedule == "fcfs"){
            if (this.currentSchedule == "fcfs"){
              _Quantum = Number.MAX_VALUE;
            }else{
              _Quantum = _RequestedQuantum;
            }
            this.roundRobin();
          }
          // priority 
          else{
            this.priority();
          }
          
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

      public priority(){
        // sort the Resident list by priority
        _ResidentList.sort((a,b) => 0 - (a.priorty > b.priority ? 1:-1));
        for (var i = 0; i < _ResidentList.length; i++){
         // console.log(_ResidentList[i].priority);
        }
        

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

      public setSchedule(algorithm){
        switch (algorithm){
          case "rr":
            this.currentSchedule = "rr";
            break;
          case "fcfs":
            this.currentSchedule = "fcfs";
            break;
          case "priority":
            this.currentSchedule = "priority";
            break;
          default:
            _StdOut.putText("Not valid scheduling algorithm. please specify either [rr, fcfs, priority].")
            break;
        }
      }

      public runAll(){
        if (this.currentSchedule == "priority"){
          this.priority();
        }
        for (var i = 0; i < _ResidentList.length;i++){
          if(_ResidentList[i].state == "Resident"){
              _CPU.isExecuting = true;
              _ResidentList[i].state = "Ready";
              _Scheduler.loadToScheduler(_ResidentList[i].pid);
          }          
      }
      }


      public terminate(pid){
        var process = this.getProcess(pid);
        process.state = "Terminated";
        _CPU.isExecuting = false;

      }

      
  }
}