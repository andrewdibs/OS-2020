module TSOS{

  export class MemoryManager{
      constructor(){

      }

      public createProcess(pid, codeList){
        // check for available space

        let pcb = new ProcessControlBlock();
        pcb.pid = pid;


      }

      public loadToMemory(program): void {
        for (let i = 0; i < program.length;i++){
          _Memory.locations[i] = program[i];
        }
    }

  }


}