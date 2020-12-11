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
        var hex = this.asciiToHex(filename);
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
      var hex = this.asciiToHex(filename);
      
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            // get next available tsb
            var key = "0:" + s + ":" + b;
            var tsb = sessionStorage.getItem(key);
            
            //format data to compare hex values
            var data = this.getFileData(tsb);
            data = data.substring(0,hex.length);

            // if in use compare file data
            if (tsb[0] == "1"){
              // if the file names match
              if (hex == data){
                var pointer = this.getNextPointer(tsb);
                
                var result = "";
                
                while(pointer != null && pointer != key){
                  tsb = sessionStorage.getItem(pointer);
                  var next = this.formatTSB(tsb);
                  result += this.getFileBlock(next);
                  console.log(next);

                  pointer = this.getNextPointer(tsb);
                }
                // convert the string of hex to ascii 
                var ascii = this.hexToAscii(result);
                _StdOut.putText(ascii);
                return;
              }
            }
          }
        }
      }
      _StdOut.putText("Please enter a valid file name.");
    }

    public write(filename, content){
      // convert file to ascii and remove quotes from content
      var hex = this.asciiToHex(filename);
      content = content.substring(1, content.length - 1);
      // find file name to write to 
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            // get next available tsb
            var key = "0:" + s + ":" + b;
            var tsb = sessionStorage.getItem(key);
            
            //format data to compare hex values
            var data = this.getFileData(tsb);
            data = data.substring(0,hex.length);

            // if in use compare file data
            if (tsb[0] == "1"){
              if (hex == data){
                // convert content to ascii
                content = this.asciiToHex(content);

                // while there is still data to write 
                while (content.length > 0){
                  // set the pointer from the previous location to the next location
                  var pointer = this.getOpenFileBlock();
                  this.setPointer(key,tsb, pointer);

                  var nextTsb = sessionStorage.getItem(pointer);
                  var next = this.formatTSB(nextTsb);
                  var thisBlock = content;
                  
                  // write content to open block 
                  if (content.length > 120){
                    thisBlock = content.substring(0,120);
                    content = content.substring(120);
                  }else{
                    // ends loop
                    content = "";
                  }
                  var index = 0;
                  next[0] = "1";
                  for (var i = 4; i < next.length; i++){
                    if (index < thisBlock.length - 1){
                      next[i] = thisBlock.charAt(index) + thisBlock.charAt(index + 1);
                      index += 2;
                    }else{
                      next[i] = "00";
                    }
                    
                  }
                  // set tsb and assign next pointers and keys
                  sessionStorage.setItem(pointer,next.join());
                  tsb = sessionStorage.getItem(pointer);
                  key = pointer;

                  Utils.updateDisk();
                  
                }
                _StdOut.putText("Succesfully wrote to " + filename + ".");
                return; 
              }
            } 
          }
        }
      }
      _StdOut.putText("File " + filename + " does not exist." );

    }

    public delete(filename){
      var hex = this.asciiToHex(filename);
      console.log("hex " + hex);
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            // get next available tsb
            var key = "0:" + s + ":" + b;
            var tsb = sessionStorage.getItem(key);
            
            //format data to compare hex values
            var data = this.getFileData(tsb);
            data = data.substring(0,hex.length);

            // if in use compare file data
            if (tsb[0] == "1"){
              if (hex == data){
                var pointer = this.getNextPointer(tsb);
                var blank = this.formatTSB(tsb);
                // set in use bit to zero and store tsb 
                for (var i = 0; i < 4; i++){
                  blank[i] = "0";
                }
                console.log(blank);
                sessionStorage.setItem("0:" + s + ":" + b, blank.join());
                
                while(pointer != null){
                  tsb = sessionStorage.getItem(pointer);
                  var next = this.formatTSB(tsb);
                  for (var i = 0; i < 4; i++){
                    next[i] = "0";
                  }
                  console.log(next);

                  sessionStorage.setItem(pointer, next.join());
                  pointer = this.getNextPointer(tsb);
                }
                
                _StdOut.putText("File " + filename + " deleted successfully.")
                Utils.updateDisk();
                return;
              }
            }
            
          }
        }
      }
      _StdOut.putText("File does not exist please enter valid file name.");
      

    }

    public getNextPointer(tsb){
      tsb = this.formatTSB(tsb);
      var pointer = tsb[1] + ":" + tsb[2] + ":" + tsb[3];

      if (pointer == "0:0:0"){
        return null;
      }
      return pointer;
    }

    public ls(){
      for (var s = 0; s < SECTORS; s++){
        for (var b = 0; b < BLOCKS; b++){
          if(s != 0 || b != 0){
            var tsb = sessionStorage.getItem("0:" + s + ":" + b);
            // if in use get file name
            if (tsb[0] == "1"){
              var next = this.formatTSB(tsb);
              var filename = this.getFileBlock(next);
              var ascii = this.hexToAscii(filename);
              
              // if the first character is a period do not show seperate swap files
              if(ascii.charAt(0) != '.'){
                _StdOut.putText(ascii);
                _StdOut.advanceLine();
              }
            }
          }
        }
      }

    }

    public format(){
      var block = new Array(64);
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

    public asciiToHex(filename){
      var hex = "";
      for (var i = 0; i < filename.length; i++){
        hex += filename.charCodeAt(i).toString(16).toUpperCase().padStart(2,"0");
      }
      return hex;
    }

    public hexToAscii(hex){
      var ascii = "";
      for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        
        console.log(ascii);
        return ascii;
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

    public getFileBlock(tsb){
      var data = "";
      for (var i = 4; i < tsb.length; i++){
        if (tsb[i] != "00")
          data += tsb[i];
      }
      data = data.replace(new RegExp(",","g"),"");
      return data;
    }

    public getPointer(tsb){
      tsb = this.formatTSB(tsb);
      return tsb[1] + ":" + tsb[2] + ":" + tsb[3];
    }

    public setPointer(key, tsb, pointer){
      
      tsb = this.formatTSB(tsb);
      tsb[0] = "1";
      tsb[1] = pointer.charAt(0);
      tsb[2] = pointer.charAt(2);
      tsb[3] = pointer.charAt(4);
      console.log(tsb);

      sessionStorage.setItem(key,tsb.join());
    }

    public getOpenFileBlock(){
      for (var t = 1; t < TRACKS; t++){
        for (var s = 0; s < SECTORS; s++){
          for (var b = 0; b < BLOCKS; b++){
            var tsb = sessionStorage.getItem(t + ":" + s + ":" + b);
            if (tsb[0] == "0"){
              return (t + ":" + s + ":" + b);
            }
          }
        }
      }
    }
  }
}