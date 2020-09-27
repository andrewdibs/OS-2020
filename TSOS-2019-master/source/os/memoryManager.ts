module TSOS{

  export class MemoryManager{
      constructor(){

      }

      public loadToMemory(program): void {
        for (let i = 0; i < program.length;i++){
          _Memory.locations[i] = program[i];
        }
        
    }

  }


}