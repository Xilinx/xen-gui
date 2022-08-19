import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-boot-configuration',
  templateUrl: './boot-configuration.component.html',
  styleUrls: ['./boot-configuration.component.scss']
})
export class BootConfigurationComponent implements OnInit {

  memory_high_value: number = 5000;
  memory_value: number = 2000;
  memory_options: Options = {
    floor: 0,
    ceil: 9999
  };

  constructor() { }

  ngOnInit() {
  }

}
