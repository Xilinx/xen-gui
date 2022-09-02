import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Colors } from '../../../models/colors.enum';
import { Domain } from '../../../models/domain';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { DomainsModalComponent } from '../modals/domains-modal/domains-modal.component';
import { LocalstorageService } from '../../../services/localstorage.service';
import { DeviceTree } from '../../../models/device-tree';
import { ModalDeviceTreeErrorComponent } from '../modals/modal-device-tree-error/modal-device-tree-error.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  domains: Domain[] = [];
  localmemory_domains: any;
  closeResult: string = '';
  tmp_color: Colors = 0;
  current_domain_index: number = -1;
  deviceTreeData: DeviceTree;


  constructor(
    private modalService: NgbModal,
    private localmemory: LocalstorageService,
    private route: Router
  ) { }

  ngOnInit() {
    /* for debug purposes
    var colors: Colors[] = [];
    for (var i = 0; i < 4; i++) {
      colors.push(this.tmp_color);
      this.tmp_color = (this.tmp_color + 1) % 16;
    }

    this.domains.push({
      name: "Stefano" + this.tmp_color,
      kernel: "elc22demo4/linuxrt",
      ramdisk: "elc22demo4/initrd.cpio",
      memory: 1024,
      vcpus: 2,
      colors: colors,
      passthrough_dtb: "elc22demo4/sram@7fe0000.dtb",
      devices: []
    });
    */
    this.localmemory_domains = this.localmemory.getData("domains");
    // transform object of objects into array of object
    for(var key in this.localmemory_domains){
      if(key != "DOM0"){
        this.domains.push(this.localmemory_domains[key]);
      }
    }
    console.log(this.domains);

    // Notify Error to user if device tree is not loaded!
    this.deviceTreeData = this.localmemory.getData("dts_data");
    if(this.deviceTreeData.availableDevices.length == 0){
      var modalRef = this.modalService.open(ModalDeviceTreeErrorComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      },);
    }

  }

  open_modal(domain_index: number = -1) {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(DomainsModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      if (domain_index > -1) {
        modalRef.componentInstance.domain = this.domains[domain_index];
        this.current_domain_index = domain_index;
      } else {
        var _domain = new Domain();
        // default values
        _domain.memory = 512 * 1024 * 1024;
        _domain.vcpus = 1;
        _domain.start_command = "console=ttyAMA0";
        modalRef.componentInstance.domain = _domain;
      }
      modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        resolve(result);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        resolve(reason);
      });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      },);

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

    var dn: Domain = <Domain>(await this.open_modal());
    console.log(dn);
    if (dn) {

      var colors: Colors[] = [];
      for (var i = 0; i < 4; i++) {
        colors.push(this.tmp_color);
        this.tmp_color = (this.tmp_color + 1) % 16;
      }

      dn.colors = colors;

      this.domains.push(dn);
      this.localmemory_domains[dn.name] = dn;
      this.localmemory.saveData("domains", this.localmemory_domains);
    }
  }

  async modifyDomain(i: number) {

    var old_dn = this.domains[i];
    var dn: Domain = <Domain>(await this.open_modal(i));
    console.log(dn);

    if (dn) {
      var colors: Colors[] = [];
      for (var i = 0; i < 4; i++) {
        colors.push(this.tmp_color);
        this.tmp_color = (this.tmp_color + 1) % 16;
      }

      dn.colors = colors;

      this.domains[this.current_domain_index] = dn;

      this.current_domain_index = -1;

      delete this.localmemory_domains[old_dn.name];
      this.localmemory_domains[dn.name] = dn;
      this.localmemory.saveData("domains", this.localmemory_domains);
    }
  }

  async deleteDomain(i: number){
    var domain_name = this.domains[i].name;
    this.domains.splice(i, 1);
    delete this.localmemory_domains[domain_name];
    this.localmemory.saveData("domains", this.localmemory_domains);

  }

  colorLabel(c: Colors): object {
    var style: any;
    style = { "background-color": "" + Colors[c] };
    if (c > Colors.lightblue)
      style["color"] = "white";
    else
      style["color"] = "black";

    return style;
  }

  gotoDetails(i: number){
    this.route.navigate(["domain/"+this.domains[i].name]);
  }



}
