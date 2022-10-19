import { Injectable } from '@angular/core';
import { BootConfiguration } from '../models/boot-configuration';
import { DeviceTree } from '../models/device-tree';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';
import { UtilsService } from './utils.service';

const { dialog } = require('electron').remote;
var fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class ImagebuilderFileManagementService {

  constructor(
    private localmemory: LocalstorageService,
    private utils: UtilsService
  ) { }


  constructFileString(){
    var boot = <BootConfiguration>this.localmemory.getData("boot_config");
    var dts = <DeviceTree>this.localmemory.getData("dts_data");
    var dom0 = <Domain>this.localmemory.getData("domains")["DOM0"];
    var colors_string: string = "";
    var min_color: number = 9999;
    var max_color: number = -1;
    var _domains = <[Domain]>this.localmemory.getData("domains");
    var domains: Domain[] = [];
    var is_cache_coloring_enabled = this.localmemory.getData("cache_coloring_enabled") || false;

    for (var key in _domains) {
      if (key != "DOM0" && key != "Xen") {
        domains.push(_domains[key]);
      }
    }

    var boot_config_file: string = `
MEMORY_START="0x${boot.memory_low_value.toString(16)}"
MEMORY_END="0x${boot.memory_high_value.toString(16)}"
LOAD_CMD="${boot.load_command}"
BOOT_CMD="${boot.boot_command}"        
    `;

    var device_tree_config_file: string = `
DEVICE_TREE="${dts.filename.replace('.dts', '.dtb')}"
    `;

    var xen_config_file: string = `
XEN="${boot.xen_binary}"
XEN_CMD="${boot.bootargs.replace(/dom0_mem=.* /gi, "").replace(/dom0_max_vcpus=.* /gi, "")} sched=${boot.scheduler} dom0_mem=${this.utils.formatBytesReduced(dom0.memory)} dom0_max_vcpus=${dom0.vcpus}"
    `;

    colors_string = "";
    min_color = dom0.colors[0];
    max_color = min_color;

    for (var j = 1; j < dom0.colors.length; ++j) {
      if (dom0.colors[j] < min_color) {
        min_color = dom0.colors[j];
      }
      if (dom0.colors[j] > max_color) {
        // check if the current max color is sequential
        if (dom0.colors[j] - 1 == max_color) {
          max_color = dom0.colors[j];
        }
        else {
          colors_string += min_color + "-" + max_color + ",";
          min_color = dom0.colors[j];
          max_color = dom0.colors[j];
        }
      }
    }
    colors_string += min_color + "-" + max_color;

    // remove useless ranges
    var tmp_colors = "";
    var _colors_string = colors_string.split(",");
    for (var j = 0; j < _colors_string.length; ++j) {
      var __colors_string = _colors_string[j].split("-");
      if (__colors_string[0] == __colors_string[1]) {
        tmp_colors += __colors_string[0] + ",";
      }
      else {
        tmp_colors += __colors_string[0] + "-" + __colors_string[1] + ",";
      }
    }
    colors_string = tmp_colors.substring(0, tmp_colors.length - 1);


    var dom0_config_file: string = `
DOM0_KERNEL="${dom0.kernel}"
DOM0_CMD="${dom0.bootargs}"
DOM0_RAMDISK="${dom0.ramdisk}"
`
    if (is_cache_coloring_enabled) {
      dom0_config_file += `
DOM0_COLORS="${colors_string}"
    `;
    }

    /* optional, not used */
    var dt_config_overlay_file: string = `
NUM_DT_OVERLAY=0
    `;

    var domu_config_file: string = `
NUM_DOMUS=${domains.length}
`;

    colors_string = "";
    for (var i = 0; i < domains.length; ++i) {
      colors_string = "";
      min_color = domains[i].colors[0];
      max_color = min_color;

      for (var j = 1; j < domains[i].colors.length; ++j) {
        if (domains[i].colors[j] < min_color) {
          min_color = domains[i].colors[j];
        }
        if (domains[i].colors[j] > max_color) {
          // check if the current max color is sequential
          if (domains[i].colors[j] - 1 == max_color) {
            max_color = domains[i].colors[j];
          }
          else {
            colors_string += min_color + "-" + max_color + ",";
            min_color = domains[i].colors[j];
            max_color = domains[i].colors[j];
          }

        }
      }
      colors_string += min_color + "-" + max_color;

      // remove useless ranges
      var tmp_colors = "";
      var _colors_string = colors_string.split(",");
      for (var j = 0; j < _colors_string.length; ++j) {
        var __colors_string = _colors_string[j].split("-");
        if (__colors_string[0] == __colors_string[1]) {
          tmp_colors += __colors_string[0] + ",";
        }
        else {
          tmp_colors += __colors_string[0] + "-" + __colors_string[1] + ",";
        }
      }
      colors_string = tmp_colors.substring(0, tmp_colors.length - 1);

      domu_config_file += `
DOMU_KERNEL[${i}]="${domains[i].kernel}"
DOMU_PASSTHROUGH_PATHS[${i}]="${domains[i].passthrough_dtb}"
DOMU_CMD[${i}]="${domains[i].bootargs}"
DOMU_RAMDISK[${i}]="${domains[i].ramdisk}"
DOMU_MEM[${i}]=${Math.ceil(domains[i].memory / 1024 / 1024)}
DOMU_VCPUS[${i}]=${domains[i].vcpus}`
      if (is_cache_coloring_enabled) {
        domu_config_file += `
DOMU_COLORS[${i}]="${colors_string}"
        `;
      }
    }

    /* optional, not used */
    var bitstream_config_file: string = `
BITSTREAM=download.bit
    `;

    /* optional, not used */
    var boot_aux_file_config_file: string = `
NUM_BOOT_AUX_FILE=2
BOOT_AUX_FILE[0]="BOOT.BIN"
BOOT_AUX_FILE[1]="uboot.cfg"
    `;

    var uboot_config_file: string = `
UBOOT_SOURCE="${boot.uboot_src}"
UBOOT_SCRIPT="${boot.uboot_script}"    
    `;

    // optional, not used
    var extra_config_file: string = `
APPEND_EXTRA_CMDS="extra.txt"
FDTEDIT="imagebuilder.dtb"
FIT="boot.fit"
FIT_ENC_KEY_DIR="dir/key"
FIT_ENC_UB_DTB="uboot.dtb"    
    `;

    var end = "\n";

    var config_file = "" +
      boot_config_file +
      device_tree_config_file +
      xen_config_file +
      dom0_config_file +
      //dt_config_overlay_file +
      domu_config_file +
      //bitstream_config_file +
      //boot_aux_file_config_file +
      uboot_config_file +
      //extra_config_file +
      end;

      return config_file;
  }
  async saveAs() {

    var options = {
      title: "Save file",
      buttonLabel: "Save",

      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    var config_file = this.constructFileString();
    const result = await dialog.showSaveDialog(options);
    if(!result){
      return false;
    }
    console.log('Save resolved:', result);
    const filePath = result;
    console.log('filePath -->', filePath);

    fs.writeFileSync(filePath, config_file, 'utf-8');

    return true;
  }
}
