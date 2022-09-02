import { Injectable } from '@angular/core';
import { diPublic } from '@angular/core/src/render3/di';
import { DeviceTree } from '../models/device-tree';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class VcpusManagementService {

  constructor(
    private localmemory: LocalstorageService
  ) { }

  // free all colors
  public reset() {
    var deviceTree: DeviceTree = this.localmemory.getData("dts_data");
    if (deviceTree) {
      this.localmemory.saveData("vcpus", deviceTree.numberOfCPUs);
    }
    else {
      // default vcpus
      this.localmemory.saveData("vcpus", 4);
    }
    var domains = this.localmemory.getData("domains");
    if (domains) {
      for (var key in domains) {
        (<Domain>domains[key]).vcpus = 0;
      }
      this.localmemory.saveData("domains", domains);
    }
  }

  public assignVcpus(domain_name: string, vcpus: number) {
    var domains = this.localmemory.getData("domains");
    var available_vcpus: number = this.localmemory.getData("vcpus");

    domains[domain_name].vcpus = vcpus;
    available_vcpus -= vcpus;

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("vcpus", available_vcpus);
  }

  public removeCpus(domain_name: string) {
    var domains = this.localmemory.getData("domains");
    var available_vcpus: number = this.localmemory.getData("vcpus");
    var vcpus = 0;

    vcpus = domains[domain_name].vcpus;
    available_vcpus += vcpus;
    domains[domain_name].vcpus = 0;

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("vcpus", available_vcpus);
  }

  public getAvailableVcpus(){
    return this.localmemory.getData("vcpus");
  }

}
