module TSOS{

  export class MemoryManager{

      public segmentStatus = [true,true,true];

      constructor(){

      }
      

      public loadToMemory(program, priority): void{
        
        // find open segment
        for (var i = 0; i < this.segmentStatus.length;i++){
          if (this.segmentStatus[i]){
            var base = i * _SegmentSize;
            var limit = base + _SegmentSize;
            
            // assign program to proper memory segment
            for (var j = base; j < program.length + base; j++){
              _Memory.locations[j] = program[j-base];
            }
            // set segment to false since it is now taken
            this.segmentStatus[i] = false;

            // Create PCB and add to PCB list 
            var currentProcess = new ProcessControlBlock();
            currentProcess.pid = _CurrentPID;
            currentProcess.base = base;
            currentProcess.limit = limit;
            currentProcess.state = "Resident";
            currentProcess.priority = priority;
            _ResidentList.push(currentProcess);
            

            _StdOut.putText("Program loaded successfully. PID: " + _CurrentPID);
            _CurrentPID++;
            return;
          }
        }
        // store program to disk 
        
          // Create PCB and add to PCB list 
          var currentProcess = new ProcessControlBlock();
          currentProcess.pid = _CurrentPID++;
          currentProcess.base = -0;
          currentProcess.limit = -0;
          currentProcess.state = "Resident";
          currentProcess.location = "Disk";
          currentProcess.priority = priority;

          var data = "";
          for (var i = 0; i < program.length; i++){
            data += program[i];
          }
          _DeviceDriverFileSystem.create(".swap" + currentProcess.pid);
          _DeviceDriverFileSystem.write(".swap" + currentProcess.pid, data);
         //unfortunaltly this breaks scheduling 
          // _ResidentList.push(currentProcess);
        

      }

      public isValidPCB(pid): boolean{
        for(var pcb of _ResidentList){
          if(pcb.pid == pid)return true;
        }
        return false;
      }

      
      public clearMemory(): void{
        for (var i = 0; i < _Memory.locations.length; i++){
          _Memory.locations[i] = "00";
        }
        this.segmentStatus = [true, true, true];
      }

      public clearSegment(index){

      }

  }


}