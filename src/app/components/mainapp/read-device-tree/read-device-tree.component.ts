import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {parse} from 'yamljs';
import {map} from 'rxjs/operators';
import { debug } from 'console';

declare var $: any;

@Component({
  selector: 'app-read-device-tree',
  templateUrl: './read-device-tree.component.html',
  styleUrls: ['./read-device-tree.component.scss']
})

export class ReadDeviceTreeComponent implements OnInit {

  deviceTreeJson: any = null;
  deviceTreeData = {
    numberOfCPUs: 0,
    memoryStartAddress: 0,
    memoryEndAddress: 0,
    numberOfAvailableDevices: 0,
    availableDevices: [],
    disabledDevices: []
  };
  dtsFile: File | null = null;
  error: boolean = false;
  
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
    tmp = tmp.replace(/\t/g, "    ");
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
    //console.log(tmp2);

    // convert YAML to JSON
    this.deviceTreeJson = parse(tmp2);

    $('#json-viewer').jsonViewer(this.deviceTreeJson, {collapsed: true});

    // count the number of cpus (how many cpu entry in devicetree)
    this.deviceTreeData.numberOfCPUs = 0;
    for (const [key, value] of Object.entries(this.deviceTreeJson["/"].cpus)) {
      if (key.indexOf("cpu") >= 0){
        this.deviceTreeData.numberOfCPUs++;
      }
    }

    // extract memory data
    // TODO
    ///////

    // count number of devices and save device name
    this.deviceTreeData.numberOfAvailableDevices = 0;
    if(this.deviceTreeJson["/"].hasOwnProperty("amba")){
      for (const [key, value] of Object.entries(this.deviceTreeJson["/"].amba)) {
        if (this.deviceTreeJson["/"].amba[key].hasOwnProperty("status")){
          if(this.deviceTreeJson["/"].amba[key].status != "disabled"){
            this.deviceTreeData.numberOfAvailableDevices++;
            this.deviceTreeData.availableDevices.push(key);
          } else {
            this.deviceTreeData.disabledDevices.push(key);
          }
        }
      }
    }
    if(this.deviceTreeJson["/"].hasOwnProperty("axi")){
      for (const [key, value] of Object.entries(this.deviceTreeJson["/"].axi)) {
        if (this.deviceTreeJson["/"].amba[key].hasOwnProperty("status")){
          if(this.deviceTreeJson["/"].amba[key].status != "disabled"){
            this.deviceTreeData.numberOfAvailableDevices++;
            this.deviceTreeData.availableDevices.push(key);
          } else {
            this.deviceTreeData.disabledDevices.push(key);
          }
        }
      }
    }
    this.deviceTreeData.availableDevices.sort();
    this.deviceTreeData.disabledDevices.sort();

    this.ref.detectChanges();
  }

  handleFileInput(files: FileList) {
    this.dtsFile = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try{
        this.readDtsString(<string>fileReader.result);
        this.error = false;
      } catch(e){
        this.error = true;
      }
    }
    fileReader.readAsText(this.dtsFile);
}

}
