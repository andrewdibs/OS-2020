module TSOS{

  export class ProcessControlBlock{
      constructor(public pid = 0,
                  public PC  = 0,
                  public Xreg = 0,
                  public Yreg = 0,
                  public base = 0,
                  public limit = 0,
                  public Zflag = 0,
                  public Acc = 0,
                  public IR = ""){
 
      }
      public init(): void{
        this.pid = 0;
        this.PC = 0;
        this.Xreg = 0;
        this.Yreg = 0;
        this.base = 0;
        this.limit = 0;
        this.Zflag = 0;
        this.Acc = 0;
        this.IR = "";
      }
      
  }
  


}