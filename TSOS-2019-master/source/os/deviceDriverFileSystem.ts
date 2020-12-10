module TSOS{
  export class DeviceDriverFileSystem extends DeviceDriver{
    constructor(public formatted = false){
      super();

    }

    public create(filename){
      // find open directory 
      var tsb = this.getOpenDirectory();

      // if there is an open directory insert filename
      if (tsb){
        // convert filename to hex
        var hex = this.fileNameToHex(filename);
        console.log(hex);
        var key = tsb.replace(new RegExp(":","g"),"");
        var data = "1" + key + hex;
        var array = this.formatTSB(data);
        // create tsb 
        sessionStorage.setItem(tsb,array.join());

        Utils.updateDisk();

      }
      else{
        _StdOut.putText("No open directories.")
      }
    }

    public read(filename){

    }

    public write(filename, data){

    }

    public delete(filename){
      var hex = this.fileNameToHex(filename);
      console.log("hex " + hex);
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            // get next available tsb
            var tsb = sessionStorage.getItem("0:" + s + ":" + b);
            
            //format data to compare hex values
            var data = this.getFileData(tsb);
            data = data.substring(0,hex.length);

            // if in use compare file data
            if (tsb[0] == "1"){
              if (hex == data){
                var blank = this.formatTSB(tsb);
                // set in use bit to zero and store tsb 
                blank[0] = "0";
                sessionStorage.setItem("0:" + s + ":" + b, blank.join());
                _StdOut.putText("File " + filename + " deleted successfully.")
                return;
              }
            }
            
          }
        }
      }
      _StdOut.putText("File does not exist please enter valid file name.");
      Utils.updateDisk();

    }

    public ls(){

    }

    public format(){
      var block = new Array(64);
      // pad start for disk
      for (var i = 0; i < block.length; i++){
        i < 4 ? block[i] = "0" : block[i] = "00";
      }
      // join into a single string to assign tsb
      var data = block.join();
      console.log(data);
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

    public getOpenDirectory(){
      // find open directory 
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            var data = sessionStorage.getItem("0:" + s + ":" + b);
            if (data.charAt(0) == "0"){
               return  "0:" + s + ":" + b;
            }
          }
        }
      }
      return null;
    }

    public formatTSB(data){
      data = data.replace(new RegExp(",","g"),"");
      var tsb = new Array(64);
      var index = 0;
      for (var i = 0; i < data.length - 1; i++){
        
        if (i < 4 ){
          tsb[index++] = data.charAt(i);
        }else{
          var t = i;
          tsb[index++] = data.substring(i,i+2);
          i++;
        }
      }

      for( var j = 0; j < tsb.length; j++){
        if (tsb[j] == null){
          tsb[j] = "00";
        }
      }
      
     return tsb;
    }

    public fileNameToHex(filename){
      var hex = "";
      for (var i = 0; i < filename.length; i++){
        hex += filename.charCodeAt(i).toString(16).toUpperCase().padStart(2,"0");
      }
      return hex;
    }

    public getFileData(tsb){
      var data = "";
      for (var i = 8; i < tsb.length; i++){
        if (tsb[i] != "00")
          data += tsb[i];
      }
      data = data.replace(new RegExp(",","g"),"");
      return data;
    }


  }
}