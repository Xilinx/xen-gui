import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import * as yamljs from 'yamljs';
import { Domain } from '../models/domain';
import { BootConfiguration } from '../models/boot-configuration';
import { DeviceTree } from '../models/device-tree';
import { UtilsService } from './utils.service';

const { dialog } = require('electron').remote;
var fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class YamlFileManagementService {

  constructor(
    private localmemory: LocalstorageService,
    private utils: UtilsService
  ) { }

  async saveAs() {
    var options = {
      title: "Save file",
      buttonLabel: "Save",

      filters: [
        { name: 'YAML', extensions: ['yaml'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    const result = await dialog.showSaveDialog(options);
    if(!result){
      return "";
    }

    console.log('Save resolved:', result);
    const filePath = result;
    console.log('filePath -->', filePath);

    /////////////////////
    var domains: [Domain] = this.localmemory.getData("domains");
    var boot_config: BootConfiguration = this.localmemory.getData("boot_config");
    var dts: DeviceTree = this.localmemory.getData("dts_data");
    var dts_json = this.localmemory.getData("dts_json");
    var is_cache_coloring_enabled = this.localmemory.getData("cache_coloring_enabled") || false;

    boot_config.bootargs += " sched=" + boot_config.scheduler;
    var memory = [];
    for (var i = 0; i < dts.memories.length; ++i) {
      memory.push({
        start: "0x" + dts.memories[i].startAddress.toString(16),
        size: "0x" + dts.memories[i].size.toString(16)
      })
    };

    delete domains["Xen"];
    domains["dom0"] = domains["DOM0"];
    delete domains["DOM0"];

    for (var key in domains) {
      domains[key]["kernel-path"] = domains[key].kernel;
      delete domains[key].kernel;

      domains[key]["ramdisk-path"] = domains[key].ramdisk;
      delete domains[key].ramdisk;

      // calculate colors range
      if (is_cache_coloring_enabled) {
        if (domains[key].colors.length > 0) {
          var colors_string = "";
          var min_color = domains[key].colors[0];
          var max_color = min_color;

          for (var j = 1; j < domains[key].colors.length; ++j) {
            if (domains[key].colors[j] < min_color) {
              min_color = domains[key].colors[j];
            }
            if (domains[key].colors[j] > max_color) {
              // check if the current max color is sequential
              if (domains[key].colors[j] - 1 == max_color) {
                max_color = domains[key].colors[j];
              }
              else {
                colors_string += min_color + "-" + max_color + ",";
                min_color = domains[key].colors[j];
                max_color = domains[key].colors[j];
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

          delete domains[key].colors;
          (<any>domains[key]).colors = colors_string;
        }
      }
      else {
        delete domains[key].colors;
      }

      var mem = domains[key].memory;
      delete domains[key].memory;
      (<any>domains[key]).memory = { size: this.utils.formatBytes(mem) };

      (<any>domains[key]).access = [];
      for (var j = 0; j < domains[key].devices.length; ++j) {
        (<any>domains[key]).access.push(
          {
            dev: domains[key].devices[j].label
          }
        )
      }
      delete domains[key].devices;

    }

    var dump = {
      domains: {
        xen: {
          bootargs: boot_config.bootargs,
          memory: memory,
          "kernel-path": "/path/to/xen",
          domains: domains
        },
        "device-tree": dts_json
      }
    };

    console.log(dump);

    var yaml_string = yamljs.stringify(dump, 32, 4);

    fs.writeFileSync(filePath, yaml_string, 'utf-8');

    return filePath;
  }

}
