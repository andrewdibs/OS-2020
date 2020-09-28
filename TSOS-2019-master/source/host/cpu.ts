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
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
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
            switch(command){
                case "A9":
                    this.Acc = _Memory.locations[this.PC + 1];
                    this.PC += 2;
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
            var location = parseInt(_MemoryManager.read(this.PC + 1) + _MemoryManager.read(this.PC),16);
            this.Acc = _MemoryManager.read(location);
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
        // 6D
        public addWithCarry(){
            // get value of next bytes location and add to the accumulator 
            this.PC++;
            
            // read next two bytes
            var location = this.getAddress();
            this.PC++;

            this.Acc += parseInt(_MemoryManager.read(location), 16);

            this.PC++;
        }
        // A2
        public loadXregConst(){
            

        }
        // AE
        public loadXregMemory(){
            
        }
        // A0
        public loadYregConst(){
            
        }
        // AC
        public loadYregMemory(){
            
        }
        // EC
        public compareXtoMemory(){
            
        }
        // D0
        public branch(){
            
        }
        // EE
        public increment(){
            
        }
        // FF
        public systemCall(){
            
        }


        public getAddress(){
            return parseInt(_MemoryManager.read(this.PC + 1) + _MemoryManager.read(this.PC),16);
        }

    }
}
