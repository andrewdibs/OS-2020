/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public IR: string = "",
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            
            // get next op code based off the PC counter
            var command = _Memory.locations[this.PC];
            this.executeOpCode(command);


        }

        public executeOpCode(command){
            this.IR = command;
            switch(command){
                case "A9":
                    this.PC++;
                    this.Acc = parseInt(_Memory.locations[this.PC++],16);
                    break;
                case "AD": 
                    this.loadAcc();
                    break;
                case "8D": 
                    this.storeAcc();
                    break;
                case "6D": 
                    this.addWithCarry();
                    break;
                case "A2":
                    //  loads the x register with constant
                    this.loadXregConst();
                    break;
                case "AE":
                    // load x register with value from memory
                    this.loadXregMemory(); 
                    break;
                case "A0":
                    // load y register with constant 
                    this.loadYregConst();
                    break;
                case "AC":
                    // loads y register with value from memory
                    this.loadYregMemory();
                    break;
                case "EA":
                    // do nothing
                    break;
                case "00":
                    // break
                    console.log("00");
                    this.isExecuting = false;
                    break;
                case "EC":
                    // compare x reg with memory value and if equal : set zflag to 1
                    this.compareXtoMemory();
                    break;
                case "D0":
                    //branch if zflag is currently 0 
                    this.branch();
                    break;
                case "EE":
                    // increment
                    this.increment();
                    break;
                case "FF":
                    // system call 
                    this.systemCall();
                    break; 
                default: 
                    console.log("invalid op codes");
            }
        }

        // A9
        public loadAcc(){
            // load the accumulator with data from memory address
            this.PC++;
            var location = parseInt(_MemoryManager.read(this.PC + 1) + _MemoryManager.read(this.PC++),16);
            this.Acc = parseInt(_MemoryManager.read(location),16);
            this.PC++;

        }
        //AD
        public storeAcc(){
            this.PC++;
            // find sta address and write acc to that location
            var location = parseInt(_MemoryManager.getLocation(this.PC),16);
            _MemoryManager.writeByte(location, parseInt(this.Acc.toString(),16));
            this.PC++;
            
        }
        // 6D // hmmm not sure if this is working correctly
        public addWithCarry(){
            // get value of next bytes location and add to the accumulator 
            this.PC++;
            // read next two bytes
            var location = this.getAddress();
            // add to accumulator
            this.Acc += parseInt(_MemoryManager.read(location), 16);
            this.PC++;
            console.log("location: "+location);
            console.log("ACC " + this.Acc);
            console.log("PC: " + this.PC);
            console.log(parseInt(_MemoryManager.read(location),16));
        }
        // A2
        public loadXregConst(){
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.read(this.PC++),16); 
        }
        // AE
        public loadXregMemory(){
            this.PC++;
            var location = this.getAddress();
            this.Xreg = parseInt(_MemoryManager.read(location),16);
            this.PC += 2;
            
        }
        // A0
        public loadYregConst(){
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.read(this.PC++),16);
            console.log(this.Yreg);
        }
        // AC
        public loadYregMemory(){
            this.PC++;
            var location = this.getAddress();
            this.Yreg = parseInt(_MemoryManager.read(location),16);
            this.PC += 2;
        }
        // EC
        public compareXtoMemory(){
            this.PC++;
            var location = this.getAddress();
            if(parseInt(_MemoryManager.read(location)) === this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }
            this.PC++;
        }
        // D0
        public branch(){
            this.PC++;
            if(this.Zflag === 0){
                this.PC += parseInt(_MemoryManager.read(this.PC),16);
                this.PC++; // + (this.PC % 256); possible wrap around not sure yet
            }
            else{
                this.PC++;
            }
        }
        // EE
        public increment(){
            this.PC++;
            var location = this.getAddress();
            _MemoryManager.writeByte(location, parseInt(_MemoryManager.read(location),16) + 1);
            this.PC += 2;
        }
        // FF
        public systemCall(){
            // if the x register = 1 print y register integer
            var params = [];
            
            if (this.Xreg === 1){
                params.push(this.Yreg.toString());
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL,params));
            }
            if (this.Xreg === 2){
                var result = "";
                for (var i = 0; i + this.Yreg < _Memory.locations.length; i++){
                    var location = _Memory.locations[this.Yreg + i];
                    console.log("location:"+location);
                    if (location == "00"){
                        break;
                    }
                    else{
                        result += String.fromCharCode(location);
                    }
                }
                console.log(params[0]);
                params.push(result)
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL,params));
            }

            this.PC++;
        }


        public getAddress(){
            return parseInt(_MemoryManager.read(this.PC + 1) + _MemoryManager.read(this.PC),16);
        }

        

    }
}
