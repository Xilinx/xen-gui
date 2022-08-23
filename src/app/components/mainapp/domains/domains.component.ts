import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Colors } from '../../../models/colors.enum';
import { Domain } from '../../../models/domain';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { DomainsModalComponent } from '../modals/domains-modal/domains-modal.component';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  domains: Domain[] = [];
  closeResult: string = '';
  tmp_color: Colors = 0;


  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    var colors: Colors[] = [];
    for(var i = 0; i < 4; i++){
      colors.push(this.tmp_color);
      this.tmp_color = (this.tmp_color + 1) % 16;
    }

    this.domains.push({
      name: "Stefano"+this.tmp_color,
      kernel: "elc22demo4/linuxrt",
      ramdisk: "elc22demo4/initrd.cpio",
      memory: 1024,
      vcpus: 2,
      colors: colors,
      passthrough_dtb: "elc22demo4/sram@7fe0000.dtb"
    });

  }

  open_modal(domain_index: number = -1) {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(DomainsModalComponent, {ariaLabelledBy: 'modal-basic-title'});
      if(domain_index > -1){
        modalRef.componentInstance.domain = this.domains[domain_index];
      } else {
        modalRef.componentInstance.domain = new Domain();
      }
      modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        resolve(reason);
      });
      setTimeout(()=>{
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      }, 
      250);
 
    });

  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async addDomain() {

    var nn = await this.open_modal();
    console.log(nn);

    var colors: Colors[] = [];
    for(var i = 0; i < 4; i++){
      colors.push(this.tmp_color);
      this.tmp_color = (this.tmp_color + 1) % 16;
    }

    this.domains.push({
      name: "Stefano"+this.tmp_color,
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
