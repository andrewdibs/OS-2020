module TSOS{
  export class DeviceDriverFileSystem extends DeviceDriver{
    constructor(public formatted = false){
      super();

    }

    public create(filename){

    }

    public read(filename){

    }

    public write(filename, data){

    }

    public delete(filename){

    }

    public format(){
      var block = new Array(60);
      // pad start for disk
      for (var i = 0; i < block.length; i++){
        i < 4 ? block[i] = "0" : block[i] = "00";
      }
      // join into a single string to assign tsb
      var data = block.join();
      // finally format disk 
      for (let t = 0; t < TRACKS; t++){
        for (let s = 0; s < SECTORS; s++){
          for (let b = 0; b < BLOCKS; b++){
            sessionStorage.setItem(t + ":" + s + ":" + b, data);
          }
        }
      }
      // update the display 
      Utils.updateDisk();

    }




  }
}