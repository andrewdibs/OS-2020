module TSOS{

  export class MemoryManager{
      constructor(){

      }

      public loadToMemory(program): void {
        for (let i = 0; i < program.length;i++){
          _Memory.locations[i] = program[i];
        }
        
      }

      public isValidPCB(pid): boolean{
        for(var pcb of _PCB){
          if(pcb.pid == pid)return true;
        }
        return false;
      }

      
      public getLocation(address): String{
        return _Memory.locations[address];
      }

      public writeByte(address, value): void{
        if (value.length === 1) value = "0" + value;
        _Memory.locations[address] = value;
      }

      public read(address): String{
        return _Memory.locations[address];
      }

  }


}