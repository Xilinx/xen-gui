import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {parse} from 'yamljs';
import {map} from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-read-device-tree',
  templateUrl: './read-device-tree.component.html',
  styleUrls: ['./read-device-tree.component.scss']
})

export class ReadDeviceTreeComponent implements OnInit {

  deviceTreeJson = {
    "a": 10,
    "b": 20,
    "c": {
      "d": "blabla"
    }
  };

  dtsFile: File | null = null;


  dts = `
  /dts-v1/;

  / {
      node1 {
          a-string-property = "A string";
          a-string-list-property = "first string", "second string";
          // hex is implied in byte arrays. no '0x' prefix is required
          a-byte-data-property = [01 23 34 56];
          child-node1 {
              first-child-property;
              second-child-property = <1>;
              a-string-property = "Hello, world";
          };
          child-node2 {
          };
      };
      node2 {
          an-empty-property;
          a-cell-property = <1 2 3 4>; /* each number (cell) is a uint32 */
          child-node1 {
          };
      };
  };
  `;
  
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    //this.readDtsString(this.dts);
  }

  private readDtsString(s: string){
    var tmp = s;
    tmp = tmp.replace(/\/dts.*\/;/g, "");
    tmp = tmp.replace(/\/include.*/g, "");
    tmp = tmp.replace(/};/g, "");
    tmp = tmp.replace(/{/g, ":");
    tmp = tmp.replace(/=/g, ":");
    tmp = tmp.replace(/</g, "[");
    tmp = tmp.replace(/>/g, "]");
    tmp = tmp.replace(/\/\*(.*)\*\//gs, "");
    tmp = tmp.replace(/\r/g, '\n');
    //tmp = tmp.replace(/code( )*=( )*\"(\r?\n)*(.)*\";/gs, ""); 

    var check = tmp.split(/\n/);

    for(var i = 0; i < check.length; i++){

      // if is a comment
      if(check[i].indexOf("//") >= 0 || check[i].indexOf("#") >= 0){
        check[i] = "";
      }

      // if there is a terminator character
      if(check[i].indexOf(";") >= 0){
        check[i] = check[i].replace(/;/g, "");
        // if there is a terminator character BUT the attribute is empty
        if(check[i].indexOf(":") < 0){
          check[i] = check[i].substring(0,check[i].length) + ": \"\"";
        }
      }

      // if there is an array but is not group by square parenthesis
      if(check[i].indexOf(":") >= 0 && check[i].indexOf(",") >= 0 && check[i].match(/\"/g) && check[i].match(/\"/g).length > 2 && (check[i].indexOf("[") < 0 || check[i].indexOf("]") < 0)){
        var index = check[i].indexOf(":");
        check[i] = check[i].substring(0,index+1) + " [" + check[i].substring(index+2,check[i].length) + " ]";

      }

      // if is an array without comma
      if(check[i].indexOf("[") >= 0 && check[i].indexOf("]") >= 0 && check[i].indexOf(",") < 0){
        var index_s = check[i].indexOf("[");
        var index_e = check[i].indexOf("]");
        var _s = check[i].substring(index_s+1, index_e+1);
        _s = _s.replace(/ /g, ",");
        check[i] = check[i].substring(0, index_s+1) + _s;
      }

      // "code" tag not supported
      if(check[i].match(/code( )*:( )*\"/g)){
        while(!check[i].match(/\";/gs)){
          check[i] = "";
          i++;
        }
        check[i] = "";
      }

    }

    var tmp2 = check.join("\n");
    console.log(tmp2);

    // convert YAML to JSON
    this.deviceTreeJson = parse(tmp2);

    $('#json-viewer').jsonViewer(this.deviceTreeJson);

    this.ref.detectChanges();
  }

  handleFileInput(files: FileList) {
    this.dtsFile = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.readDtsString(<string>fileReader.result);
    }
    fileReader.readAsText(this.dtsFile);
}

}
