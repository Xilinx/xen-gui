import { Injectable } from '@angular/core';
import { Colors } from '../models/colors.enum';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsManagementService {

  constructor(
    private localmemory: LocalstorageService
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

  public autoAssignColor(domain_name: string, memory: number = -1) {
    var domains = this.localmemory.getData("domains");
    var available_colors: Colors[] = this.localmemory.getData("colors");

    if (memory == -1) {
      domains[domain_name].colors.push(available_colors.shift());
    }
    else {
      var mem = memory / 1024 / 1024;
      var num_colors = Math.ceil(mem / 256);
      for (var i = 0; i < num_colors && available_colors.length > 0; ++i) {
        // anomaly!!!
        if (i > 15) {
          break;
        }
        domains[domain_name].colors.push(available_colors.shift());
      }
    }

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("colors", available_colors);
  }

  public autoRemoveColors(domain_name: string) {
    var domains = this.localmemory.getData("domains");
    var available_colors: Colors[] = this.localmemory.getData("colors");

    while(domains[domain_name].colors.length > 0) {
      available_colors.push(domains[domain_name].colors.shift())
    }
    available_colors.sort(function(a,b) {return a - b;});

    this.localmemory.saveData("colors", available_colors);
    this.localmemory.saveData("domains", domains);
  }

}
