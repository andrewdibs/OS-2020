module TSOS{

    export class MemoryAccessor{
        constructor(){
        }

        public read(base, address): String{
            let physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0){
                // error return
                // TODO: 
                console.log(" out of bounds error");
                // terminate process
                return; 
            }
            return _Memory.locations[physical];
        }

        public getLocation(base, address): String{
            let physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0){
                // error return
                console.log(" out of bounds error");
                // terminate process
                return; 
            }
            return _Memory.locations[physical];
        }
    
        public writeByte(base, address, value): void{
            // pad the hex value for single digit 
            if (value.length === 1) value = "0" + value;

            let physical = base + address;
            // memory bounds
            if (physical >= base + 256 || address < 0){
                // error return
                
                // terminate process
                return; 
            }
            _Memory.locations[physical] = value;
            return;
        }

    }
    


}