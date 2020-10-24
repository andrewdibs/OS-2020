module TSOS{

  export class MemoryManager{

      public segmentStatus = [true,true,true];

      constructor(){

      }
      

      public loadToMemory(program): void {

        // find open segment
        for (var i = 0; i < this.segmentStatus.length;i++){
          if (this.segmentStatus[i]){
            var base = i * _SegmentSize;
            var limit = base + _SegmentSize;
            console.log("base : " + base);
            
            for (var j = base; j < program.length + base; j++){
              _Memory.locations[j] = program[j-base];
              console.log(j);
            }

            this.segmentStatus[i] = false;
            return;
          }
        }

        // else no memory segments available
        _StdOut.putText("No memory segments available for use. Please clear memory using clearmem command.");
        
        
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

      public clearMemory(): void{
        for (var i = 0; i < _Memory.locations.length; i++){
          _Memory.locations[i] = "00";
        }
      }

  }


}