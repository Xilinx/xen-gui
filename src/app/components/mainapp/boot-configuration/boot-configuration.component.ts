import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { UtilsService } from '../../../services/utils.service';
import { DeviceTree } from '../../../models/device-tree';
import { LocalstorageService } from '../../../services/localstorage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeviceTreeErrorComponent } from '../modals/modal-device-tree-error/modal-device-tree-error.component';
import { BootConfiguration } from '../../../models/boot-configuration';

@Component({
  selector: 'app-boot-configuration',
  templateUrl: './boot-configuration.component.html',
  styleUrls: ['./boot-configuration.component.scss']
})
export class BootConfigurationComponent implements OnInit {

  deviceTreeData: DeviceTree;
  cache_coloring_enabled: boolean;
  total_memory: number;
  memory_options: Options = {
    floor: 0,
    ceil: 4000000000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return  this.utils.formatBytes(value);//'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
        case LabelType.High:
          return this.utils.formatBytes(value); //'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
        default:
          return this.utils.formatBytes(value);//'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
      }
    }
  };
  bootConfig: BootConfiguration;

  constructor(
    public utils: UtilsService,
    private localmemory: LocalstorageService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {

    // Notify Error to user if device tree is not loaded!
    this.deviceTreeData = this.localmemory.getData("dts_data");
    if(!this.deviceTreeData || this.deviceTreeData.availableDevices.length == 0){
      var modalRef = this.modalService.open(ModalDeviceTreeErrorComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      },);
      this.bootConfig = new BootConfiguration();
      this.bootConfig.memory_high_value = this.memory_options.ceil;
    }
    else {
      this.bootConfig = this.localmemory.getData("boot_config");
      var memsize = 0;
      for(var i = 0; i < this.deviceTreeData.memories.length; ++i){
        memsize += this.deviceTreeData.memories[i].size;
      }
      this.memory_options.ceil = memsize;
      this.total_memory = memsize;
      if(!this.bootConfig){
        this.bootConfig = new BootConfiguration();
        this.total_memory = memsize;
      }
      
    }

    this.cache_coloring_enabled = this.localmemory.getData("cache_coloring_enabled") || false;

  }

  async change_cache_coloring_enabled(isChecked) {
    this.cache_coloring_enabled = isChecked;
    this.localmemory.saveData("cache_coloring_enabled", this.cache_coloring_enabled);
  }


  save() {
    this.localmemory.saveData("boot_config", this.bootConfig);
    this.localmemory.saveData("cache_coloring_enabled", this.cache_coloring_enabled);
    this.localmemory.saveData("scheduler", this.bootConfig.scheduler);
  }

  ceil(n: number){
    return Math.ceil(n);
  }

}
