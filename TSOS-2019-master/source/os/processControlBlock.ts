module TSOS{

  export class ProcessControlBlock{
      constructor(public pid = 0,
                  public PC  = 0,
                  public Xreg = 0,
                  public Yreg = 0,
                  public Zflag = 0,
                  public Acc = 0,
                  public IR = ""){
 
      }
      
  }


}