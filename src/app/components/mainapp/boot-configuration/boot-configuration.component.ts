import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-boot-configuration',
  templateUrl: './boot-configuration.component.html',
  styleUrls: ['./boot-configuration.component.scss']
})
export class BootConfigurationComponent implements OnInit {

  
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
  bootConfig = {
    memory_high_value: 4000000000,
    memory_low_value: 0,
    load_command: "",
    boot_command: "",
    xen_binary: "",
    xen_command: ""

  }

  constructor(
    private utils: UtilsService
  ) { }

  ngOnInit() {
  }

  save() {
    console.log(this.bootConfig);
  }

}
