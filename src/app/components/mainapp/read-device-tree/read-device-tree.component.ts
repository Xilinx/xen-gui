import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { parse } from 'yamljs';
import { map } from 'rxjs/operators';
import { DeviceTree } from '../../../models/device-tree';
import { Device } from '../../../models/device';
import { Memory } from '../../../models/memory';
import { UtilsService } from '../../../services/utils.service';

declare var $: any;

@Component({
  selector: 'app-read-device-tree',
  templateUrl: './read-device-tree.component.html',
  styleUrls: ['./read-device-tree.component.scss']
})

export class ReadDeviceTreeComponent implements OnInit, AfterViewInit {

  deviceTreeJson: any = null;
  deviceTreeData: DeviceTree;
  dtsFile: File | null = null;
  error: boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    private utils: UtilsService
    ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    //this.readDtsString(this.dts);
  }

  private async readDtsString(s: string) {
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

    var check = tmp.split(/\n/);

    for (var i = 0; i < check.length; i++) {

      // if is a comment
      if (check[i].indexOf("//") >= 0 || check[i].indexOf("#") >= 0) {
        check[i] = "";
      }

      // if there is a terminator character
      if (check[i].indexOf(";") >= 0) {
        check[i] = check[i].replace(/;/g, "");
        // if there is a terminator character BUT the attribute is empty
        if (check[i].indexOf(":") < 0) {
          check[i] = check[i].substring(0, check[i].length) + ": \"\"";
        }
      }

      // if there is an array but is not group by square parenthesis
      if (check[i].indexOf(":") >= 0 && check[i].indexOf(",") >= 0 && check[i].match(/\"/g) && check[i].match(/\"/g).length > 2 && (check[i].indexOf("[") < 0 || check[i].indexOf("]") < 0)) {
        var index = check[i].indexOf(":");
        check[i] = check[i].substring(0, index + 1) + " [" + check[i].substring(index + 2, check[i].length) + " ]";

      }

      // if is an array without comma
      if (check[i].indexOf("[") >= 0 && check[i].indexOf("]") >= 0 && check[i].indexOf(",") < 0) {
        var index_s = check[i].indexOf("[");
        var index_e = check[i].indexOf("]");
        var _s = check[i].substring(index_s + 1, index_e + 1);
        _s = _s.replace(/ /g, ",");
        check[i] = check[i].substring(0, index_s + 1) + _s;
      }

      // "code" tag not supported
      if (check[i].match(/code( )*:( )*\"/g)) {
        while (!check[i].match(/\";/gs)) {
          check[i] = "";
          i++;
        }
        check[i] = "";
      }

    }

    var tmp2 = check.join("\n");

    // convert YAML to JSON
    this.deviceTreeJson = parse(tmp2);

    $('#json-viewer').jsonViewer(this.deviceTreeJson, { collapsed: true });

    this.deviceTreeData = new DeviceTree();

    // count the number of cpus (how many cpu entry in devicetree)
    this.deviceTreeData.numberOfCPUs = 0;
    for (const [key, value] of Object.entries(this.deviceTreeJson["/"].cpus)) {
      if (key.indexOf("cpu") >= 0) {
        this.deviceTreeData.numberOfCPUs++;
      }
    }

    // extract memory data
    const chunkSize = 4;
    if (this.deviceTreeJson["/"].hasOwnProperty("memory")) {
      var _memory = this.deviceTreeJson["/"].memory.reg;
      for (let i = 0; i < _memory.length; i += chunkSize) {
        var chunk = _memory.slice(i, i + chunkSize);
        this.deviceTreeData.numberOfMemories++;
        this.deviceTreeData.memories.push(new Memory(chunk[0], chunk[0] + chunk[3], chunk[3]));
      }
    }

    // count number of devices and save device name
    this.deviceTreeData.numberOfAvailableDevices = 0;
    if (this.deviceTreeJson["/"].hasOwnProperty("amba")) {
      for (const [key, value] of Object.entries(this.deviceTreeJson["/"].amba)) {
        if (this.deviceTreeJson["/"].amba[key].hasOwnProperty("status")) {
          if (this.deviceTreeJson["/"].amba[key].status != "disabled") {
            this.deviceTreeData.numberOfAvailableDevices++;
            this.deviceTreeData.availableDevices.push(new Device(key.split("@")[0], parseInt(key.split("@")[1], 16)));
          } else {
            this.deviceTreeData.disabledDevices.push(new Device(key.split("@")[0], parseInt(key.split("@")[1], 16)));
          }
        }
      }
    }
    if (this.deviceTreeJson["/"].hasOwnProperty("axi")) {
      for (const [key, value] of Object.entries(this.deviceTreeJson["/"].axi)) {
        if (this.deviceTreeJson["/"].amba[key].hasOwnProperty("status")) {
          if (this.deviceTreeJson["/"].amba[key].status != "disabled") {
            this.deviceTreeData.numberOfAvailableDevices++;
            this.deviceTreeData.availableDevices.push(new Device(key.split("@")[0], parseInt(key.split("@")[1], 16)));
          } else {
            this.deviceTreeData.disabledDevices.push(new Device(key.split("@")[0], parseInt(key.split("@")[1], 16)));
          }
        }
      }
    }
    this.deviceTreeData.availableDevices.sort();
    this.deviceTreeData.disabledDevices.sort();

    this.ref.detectChanges();

    // https://github.com/ColorlibHQ/AdminLTE/issues/1822#issuecomment-404761829
    // workaround for activating collapse boxwidget
    // $("#box-widget").boxWidget()
    await this.utils.waitSeconds(0.100);
    var boxes = $("div.box[data-widget]");
    for (var i = 0; i < boxes.length; ++i) {
      $(boxes[i]).boxWidget();
    }
  }

  handleFileInput(files: FileList) {
    this.dtsFile = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        this.readDtsString(<string>fileReader.result);
        this.error = false;
      } catch (e) {
        console.error(e);
        this.error = true;
      }
    }
    fileReader.readAsText(this.dtsFile);
  }

}
