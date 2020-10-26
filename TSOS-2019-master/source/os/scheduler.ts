module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue(),
                  public residentList = []
                  ) {
      }

       

      public loadToCPU(){
        if (!this.readyQueue.isEmpty()){

        }
      }

      public loadToScheduler(process): void{
        this.residentList.push(process);
        this.readyQueue.enqueue(process.pid);
        

        
      }

      
  }
}