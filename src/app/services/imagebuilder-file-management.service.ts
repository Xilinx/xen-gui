import { Injectable } from '@angular/core';
import { BootConfiguration } from '../models/boot-configuration';
import { DeviceTree } from '../models/device-tree';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';

const { dialog } = require('electron').remote;
var fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class ImagebuilderFileManagementService {

  constructor(
    private localmemory: LocalstorageService
  ) { }

  async saveAs() {
    var boot = <BootConfiguration>this.localmemory.getData("boot_config");
    var dts = <DeviceTree>this.localmemory.getData("dts_data");
    var dom0 = <Domain>this.localmemory.getData("domains")["DOM0"];
    var colors_string: string = "";
    var _domains = <[Domain]>this.localmemory.getData("domains");
    var domains: Domain[] = [];
    for (var key in _domains) {
      if (key != "DOM0" && key != "Xen") {
        domains.push(_domains[key]);
      }
    }


    var options = {
      title: "Save file",
      buttonLabel: "Save",

      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    var boot_config_file: string = `
MEMORY_START="0x${boot.memory_low_value.toString(16)}"
MEMORY_END="0x${boot.memory_high_value.toString(16)}"
LOAD_CMD="${boot.load_command}"
BOOT_CMD="${boot.boot_command}"        
    `;

    var device_tree_config_file: string = `
DEVICE_TREE="${dts.filename}"
    `;

    var xen_config_file: string = `
XEN="${boot.xen_binary}"
XEN_CMD="${boot.xen_command}"
PASSTHROUGH_DTS_REPO="git@github.com:Xilinx/xen-passthrough-device-trees.git device-trees-2021.2"    
    `;

    colors_string = "";
    for (var j = 0; j < dom0.colors.length; ++j) {
      colors_string += dom0.colors[j] + "-";
    }
    //remove last ""-"
    colors_string = colors_string.slice(0, -1);

    var dom0_config_file: string = `
DOM0_KERNEL="${dom0.kernel}"
DOM0_CMD="console=${dom0.start_command}"
DOM0_RAMDISK="${dom0.ramdisk}"
DOM0_MEM=${Math.ceil(dom0.memory / 1024 / 1024)}
DOM0_VCPUS=${dom0.vcpus}
DOM0_COLORS="${colors_string}"
`;

    var dt_config_overlay_file: string = `
NUM_DT_OVERLAY=0
    `;

    var domu_config_file: string = `
NUM_DOMUS=${domains.length}
`;

    colors_string = "";
    for (var i = 0; i < domains.length; ++i) {
      colors_string = "";
      for (var j = 0; j < domains[i].colors.length; ++j) {
        colors_string += domains[i].colors[j] + "-";
      }
      //remove last ""-"
      colors_string = colors_string.slice(0, -1);
      domu_config_file += `
DOMU_KERNEL[${i}]="${domains[i].kernel}"
DOMU_PASSTHROUGH_PATHS[${i}]="${domains[i].passthrough_dtb}"
DOMU_CMD[${i}]="${domains[i].start_command}"
DOMU_RAMDISK[${i}]="${domains[i].ramdisk}"
DOMU_MEM[${i}]=${Math.ceil(domains[i].memory / 1024 / 1024)}
DOMU_VCPUS[${i}]=${domains[i].vcpus}
DOMU_COLORS[${i}]="${colors_string}"
      `;
    }

    /* optional, not used */
    var bitstream_config_file: string = `
BITSTREAM=download.bit
    `;

    var boot_aux_file_config_file: string = `
NUM_BOOT_AUX_FILE=2
BOOT_AUX_FILE[0]="BOOT.BIN"
BOOT_AUX_FILE[1]="uboot.cfg"
    `;

    var uboot_config_file: string = `
UBOOT_SOURCE="boot.source"
UBOOT_SCRIPT="boot.scr"    
    `;

    // optional, not used
    var extra_config_file: string = `
APPEND_EXTRA_CMDS="extra.txt"
FDTEDIT="imagebuilder.dtb"
FIT="boot.fit"
FIT_ENC_KEY_DIR="dir/key"
FIT_ENC_UB_DTB="uboot.dtb"    
    `;

    var config_file = "" +
      boot_config_file +
      device_tree_config_file +
      xen_config_file +
      dom0_config_file +
      dt_config_overlay_file +
      domu_config_file +
      /*bitstream_config_file +*/
      boot_aux_file_config_file +
      uboot_config_file
      /*extra_config_file*/;

    const result = await dialog.showSaveDialog(options);
    console.log('Save resolved:', result);
    const filePath = result;
    console.log('filePath -->', filePath);

    fs.writeFileSync(filePath, config_file, 'utf-8');

    //this.localmemory.saveData("filename", filePath, false);

    //return filePath;
  }
}