module TSOS{

    export class MemoryAccessor{
        constructor(){
        }

        public read(address): String{
            return _Memory.locations[address];
        }

        public getLocation(address): String{
            return _Memory.locations[address];
        }
    
        public writeByte(address, value): void{
            if (value.length === 1) value = "0" + value;
            _Memory.locations[address] = value;
        }

    }
    


}