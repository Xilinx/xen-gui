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
import { ColorsManagementService } from '../../../services/colors-management.service';
import { VcpusManagementService } from '../../../services/vcpus-management.service';
import { MemoryManagementService } from '../../../services/memory-management.service';
import { BootConfiguration } from '../../../models/boot-configuration';

declare var $: any;
let spawn = require("child_process").spawn;

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
  dtc_command: string = "dtc -I dtb -O dts -o - "; // concat dtb file on this command

  constructor(
    private ref: ChangeDetectorRef,
    private utils: UtilsService,
    private xendtsutils: XenDeviceTreeUtilsService,
    private localmemory: LocalstorageService,
    private colorManager: ColorsManagementService,
    private vcpusManager: VcpusManagementService,
    private memoryManager: MemoryManagementService
  ) { }

  ngAfterViewInit(): void {
    // enable tooltips everywhere
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });
  }

  async ngOnInit() {
    //this.readDtsString(this.dts);
    if ((<DeviceTree><unknown>this.localmemory.getData("dts_data"))) {
      this.deviceTreeData = this.localmemory.getData("dts_data");
      this.deviceTreeJson = this.localmemory.getData("dts_json");
      $('#json-viewer').jsonViewer(this.deviceTreeJson, { collapsed: true });
      this.ref.detectChanges();
    } else {
      this.deviceTreeData = new DeviceTree();
    }

    // https://github.com/ColorlibHQ/AdminLTE/issues/1822#issuecomment-404761829
    // workaround for activating collapse boxwidget
    // $("#box-widget").boxWidget()
    await this.utils.waitSeconds(0.100);
    var boxes = $("div.box[data-widget]");
    for (var i = 0; i < boxes.length; ++i) {
      $(boxes[i]).boxWidget();
    }
  }

  private populateLocalMemory() {
    console.log("reconstructing local memory...");
    this.colorManager.reset();
    this.vcpusManager.reset();
    this.memoryManager.reset();
    this.localmemory.saveData("scheduler", "null");

    var dom0_default_memory = 1024 * 1024 * 1024; // 1G
    var dom0: Domain = new Domain(
      "DOM0",
      "Image-linux",
      "dom0-ramdisk.cpio",
      0,
      0,
      [],
      "",
      [],
      "console=hvc0 earlycon=xen earlyprintk=xen clk_ignore_unused root=/dev/ram0"
    );

    // Xen is not a domain, but we use it in this way for simplifying the elaboration (assign 1 color)
    var xen_dom = new Domain();

    this.localmemory.saveData("domains", {
      "Xen": xen_dom,
      "DOM0": dom0
    });

    // autoassign 1 color for Xen
    this.colorManager.autoAssignColor("Xen");
    // autoassign memory for dom0
    this.memoryManager.assignMemory("DOM0", dom0_default_memory);
    // autoassign colors for dom0
    this.colorManager.autoAssignColor("DOM0", dom0_default_memory);
    // assign one extra color
    this.colorManager.autoAssignColor("DOM0");

    this.vcpusManager.assignVcpus("DOM0", 1);

    var domains = this.localmemory.getData("domains");
    // populate DOM0 with all devices
    for (var i = 0; i < this.deviceTreeData.availableDevices.length; ++i) {
      this.deviceTreeData.availableDevices[i].selected = "DOM0";
      domains["DOM0"].devices.push(this.deviceTreeData.availableDevices[i]);
    }

    // save boot default config
    var bootConfig = new BootConfiguration();
    //bootConfig.memory_high_value = this.memoryManager.getTotalMemory();
    bootConfig.memory_high_value = this.deviceTreeData.memories[0].size;

    // save on localstorage
    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("boot_config", bootConfig);
    this.localmemory.saveData("dts_data", this.deviceTreeData);
    this.localmemory.saveData("dts_json", this.deviceTreeJson);
    this.localmemory.saveData("cache_coloring_enabled", false);
  }

  private async readDtsString(s: string) {

    try {
      var _tmp_ = this.xendtsutils.readDTSString(s);
      this.deviceTreeData = _tmp_.data;
      this.deviceTreeData.filename = this.dtsFile.name;
      this.deviceTreeJson = _tmp_.json;
      $('#json-viewer').jsonViewer(this.deviceTreeJson, { collapsed: true });

      this.ref.detectChanges();

      // https://github.com/ColorlibHQ/AdminLTE/issues/1822#issuecomment-404761829
      // workaround for activating collapse boxwidget
      // $("#box-widget").boxWidget()
      await this.utils.waitSeconds(0.100);
      var boxes = $("div.box[data-widget]");
      for (var i = 0; i < boxes.length; ++i) {
        $(boxes[i]).boxWidget();
      }

      this.localmemory.saveData("dts_data", this.deviceTreeData);
      this.localmemory.saveData("dts_json", this.deviceTreeJson);

      this.populateLocalMemory();
    }
    catch (e) {
      console.error(e);
      this.error = true;
      this.ref.detectChanges();

    }

  }

  handleFileInput(files: FileList) {
    this.dtsFile = files.item(0);
    console.log(this.dtsFile);
    this.deviceTreeData.filename = this.dtsFile.name;
    if (this.dtsFile.name.indexOf(".dtb") != -1) {
      console.log("this is a dtb file");
      try {
        let bat = spawn(this.dtc_command + this.dtsFile.path, [], { shell: true });
        var output = "";
        var err_output = "";
        bat.stdout.on("data", (data) => {
          //console.log(`stdout: ${data}`);
          output += `${data}`;
        });

        bat.stderr.on("data", (err) => {
          //console.error(`stderr: ${err}`);
          err_output += `${err}`;
        });

        bat.on("close", (code) => {
          // Handle exit
          if (output.length != 0) {
            console.log(`stdout: ${output}`);
          }
          if (err_output.length != 0) {
            console.log(`stderr: ${err_output}`);
          }
          console.log(`child process exited with code ${code}`);
          
          if(code == 0){
            console.log("code 0, command ok");
            this.readDtsString(<string>output);
          } else {
            this.error = true;
            this.ref.detectChanges();
          }
        });
      } catch (e) {
        console.error(e);
        this.error = true;
      }
      return;
    }

    // it's a dts file, so go ahead without problems
    let fileReader = new FileReader();
    this.error = false;
    fileReader.onload = (e) => {
      try {
        this.readDtsString(<string>fileReader.result);
      } catch (e) {
        console.error(e);
        this.error = true;
      }
    }
    fileReader.readAsText(this.dtsFile);
  }

}
