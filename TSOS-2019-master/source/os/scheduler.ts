module TSOS {
  export class Scheduler{
      constructor(public readyQueue = new TSOS.Queue()
                  ) {
      }

       

      public loadToCPU(){
        if (!this.readyQueue.isEmpty()){

        }
      }

      public loadToScheduler(process): void{
        this.readyQueue.enqueue(process);
        console.log("proccess id : " + process);
        console.log("ready queue: " + this.readyQueue.toString());

        
      }

      
  }
}