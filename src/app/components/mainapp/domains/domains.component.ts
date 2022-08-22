import { Component, OnInit } from '@angular/core';
import { Colors } from '../../../models/colors.enum';
import { Domain } from '../../../models/domain';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  domains : Domain[] = [];

  tmp_color: Colors = 0;

  constructor() { }

  ngOnInit() {

  }

  addDomain() {

    var colors: Colors[] = [];
    for(var i = 0; i < 4; i++){
      colors.push(this.tmp_color);
      this.tmp_color = (this.tmp_color + 1) % 16;
    }

    this.domains.push({
      name: "Stefano",
      kernel: "elc22demo4/linuxrt",
      ramdisk: "elc22demo4/initrd.cpio",
      memory: 1024,
      vcpus: 2,
      colors: colors,
      passthrough_dtb: "elc22demo4/sram@7fe0000.dtb"
    });

  }

  colorLabel(c: Colors): object {
    var style : any;
    style = {"background-color": ""+Colors[c]};
    if(c > Colors.lightblue)
      style["color"] = "white";
    else
      style["color"] = "black";

    return style;
  } 

  

}
