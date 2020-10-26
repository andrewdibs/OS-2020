module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue()
                  
                  ) {
      }

       

      public loadToCPU(process){
        if (!this.readyQueue.isEmpty()){

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
        console.log(process.state);
        console.log(_ResidentList[0].state);

      }

      
  }
}