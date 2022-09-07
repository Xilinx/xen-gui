import { Injectable } from '@angular/core';
import { Colors } from '../models/colors.enum';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';
import { MemoryManagementService } from './memory-management.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsManagementService {

  constructor(
    private localmemory: LocalstorageService,
  ) { }

  // free all colors
  public reset() {
    var colors: Colors[] = [];
    for (var i = 0; i < Colors.END; ++i) {
      colors.push(i);
    }
    this.localmemory.saveData("colors", colors);
    var domains = this.localmemory.getData("domains");
    for (var key in domains) {
      (<Domain>domains[key]).colors = [];
    }
    this.localmemory.saveData("domains", domains);
  }

  // get memory size for every color (according to Xen, there are at least 16 colors)
  public getColorMemorySize() {
    var deviceTreeData = this.localmemory.getData("dts_data");
    var memsize = 0;
    for (var i = 0; i < deviceTreeData.memories.length; ++i) {
      memsize += deviceTreeData.memories[i].size;
    }

    return Math.floor(memsize / 1024 / 1024 / 16) + 1;
  }

  public autoAssignColor(domain_name: string, memory: number = -1, color: Colors = Colors.END) {
    var domains = this.localmemory.getData("domains");
    var available_colors: Colors[] = this.localmemory.getData("colors");

    if (color == Colors.END) {

      if (memory == -1) {
        domains[domain_name].colors.push(available_colors.shift());
      }
      else {
        var mem = memory / 1024 / 1024;
        var num_colors = Math.ceil(mem / this.getColorMemorySize());
        for (var i = 0; i < num_colors && available_colors.length > 0; ++i) {
          // anomaly!!!
          if (i > 15) {
            break;
          }
          domains[domain_name].colors.push(available_colors.shift());
        }
      }
    } else {
      // if the color is available
      if (available_colors.indexOf(color) != -1) {
        var index = available_colors.indexOf(color);
        domains[domain_name].colors.push(available_colors.splice(index, 1)[0]);
      }
    }

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("colors", available_colors);
  }

  public autoRemoveColors(domain_name: string, color: Colors = Colors.END) {
    var domains = this.localmemory.getData("domains");
    var available_colors: Colors[] = this.localmemory.getData("colors");

    if (color == Colors.END) {
      while (domains[domain_name].colors.length > 0) {
        available_colors.push(domains[domain_name].colors.shift())
      }
      available_colors.sort(function (a, b) { return a - b; });
    }
    else {
      // if the color is available
      if (domains[domain_name].colors.indexOf(color) != -1) {
        var index = domains[domain_name].colors.indexOf(color);
        available_colors.push(domains[domain_name].colors.splice(index, 1)[0]);
      }

    }

    this.localmemory.saveData("colors", available_colors);
    this.localmemory.saveData("domains", domains);
  }

  public getFreeColors() {
    return this.localmemory.getData("colors");
  }

}
