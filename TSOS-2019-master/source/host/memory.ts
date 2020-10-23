module TSOS{

  export class Memory{
      constructor(public locations = new Array(_MemorySize)){

      }
      // initialize memory to 0s
      public init(): void{
        for (let i =0; i< this.locations.length;i++){
          this.locations[i] = "00";
        }
      }

      
  }


}