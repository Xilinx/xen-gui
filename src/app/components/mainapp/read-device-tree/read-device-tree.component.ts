import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { parse } from 'yamljs';
import { map } from 'rxjs/operators';
import { DeviceTree } from '../../../models/device-tree';
import { Device } from '../../../models/device';
import { Memory } from '../../../models/memory';
import { UtilsService } from '../../../services/utils.service';
import { XenDeviceTreeUtilsService } from '../../../services/xen-device-tree-utils.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { Domain } from '../../../models/domain';

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
    private utils: UtilsService,
    private xendtsutils: XenDeviceTreeUtilsService,
    private localStorage: LocalstorageService
    ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    //this.readDtsString(this.dts);
  }

  private async readDtsString(s: string) {

    var _tmp_ = this.xendtsutils.readDTSString(s);
    this.deviceTreeData = _tmp_.data;
    this.deviceTreeJson = _tmp_.json;
    $('#json-viewer').jsonViewer(this.deviceTreeJson, { collapsed: true });

    this.ref.detectChanges();

    var domains = (<Domain[]><unknown>JSON.parse(this.localStorage.getData("domains")));
    // populate DOM0 with all devices
    for(var i = 0; i < this.deviceTreeData.availableDevices.length; ++i){
      this.deviceTreeData.availableDevices[i].selected = "DOM0";
      domains["DOM0"].devices.push(this.deviceTreeData.availableDevices[i]);

    }
    // save on localstorage
    this.localStorage.saveData("domains", JSON.stringify(domains));    
    this.localStorage.saveData("dts_data", JSON.stringify(this.deviceTreeData));
    this.localStorage.saveData("dts_json", JSON.stringify(this.deviceTreeJson));

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
