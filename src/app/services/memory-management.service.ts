import { Injectable } from '@angular/core';
import { DeviceTree } from '../models/device-tree';
import { Domain } from '../models/domain';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryManagementService {

  constructor(
    private localmemory: LocalstorageService
  ) { }

  public getTotalMemory(){
    var deviceTree: DeviceTree = this.localmemory.getData("dts_data");

    var memsize = 0;
    for (var i = 0; i < deviceTree.memories.length; ++i) {
      memsize += deviceTree.memories[i].size;
    }
    return memsize;
  }

  public setTotalMemory(){
    this.localmemory.saveData("memory", this.getTotalMemory());
  }

  public getAvailableMemory(){
    return this.localmemory.getData("memory");
  }

  public reset() {
    var deviceTree: DeviceTree = this.localmemory.getData("dts_data");
    if (deviceTree) {
      this.localmemory.saveData("memory", this.getTotalMemory());
    }
    else {
      // default memory
      this.localmemory.saveData("memory", 4 * 1024 * 1024 * 1024);
    }
    var domains = this.localmemory.getData("domains");
    if (domains) {
      for (var key in domains) {
        (<Domain>domains[key]).memory = 0;
      }
      this.localmemory.saveData("domains", domains);
    }
  }

  public assignMemory(domain_name: string, memory: number) {
    var domains = this.localmemory.getData("domains");
    var available_memory: number = this.getAvailableMemory();

    domains[domain_name].memory = memory;
    available_memory -= memory;

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("memory", available_memory);
  }

  public removeMemory(domain_name: string) {
    var domains = this.localmemory.getData("domains");
    var available_memory: number = this.getAvailableMemory();
    var memory = 0;

    memory = domains[domain_name].memory;
    available_memory += memory;
    domains[domain_name].memory = 0;

    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("memory", available_memory);
  }

}
