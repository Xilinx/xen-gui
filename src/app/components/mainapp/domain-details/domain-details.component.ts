import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceTypeFilterPipe } from '../../../filters/device-type-filter.pipe';
import { Colors } from '../../../models/colors.enum';
import { Device } from '../../../models/device';
import { DeviceTree } from '../../../models/device-tree';
import { Domain } from '../../../models/domain';
import { LocalstorageService } from '../../../services/localstorage.service';
import { DomainsModalComponent } from '../modals/domains-modal/domains-modal.component';
import { ModalDeviceTreeErrorComponent } from '../modals/modal-device-tree-error/modal-device-tree-error.component';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss']
})
export class DomainDetailsComponent implements OnInit {

  domain: Domain = new Domain();
  closeResult: string;
  tmp_color: Colors;
  deviceTreeData: DeviceTree;
  all_colors: Colors[];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private localmemory: LocalstorageService
  ) {

  }

  ngOnInit() {
    var sub = this.route.params.subscribe(params => {
      var domains = this.localmemory.getData("domains");
      this.domain = <Domain>domains[params['name']];
    });
    console.log(this.domain.name);
    this.deviceTreeData = this.localmemory.getData("dts_data");
    console.log(this.deviceTreeData);
    // enable tooltips everywhere
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });

    this.all_colors = <Colors[]>(Array(Colors.END).fill(0));
    for (var i = 0; i < this.all_colors.length; ++i) {
      // Colors[0] ---> "orange"
      // Colors["orange"] ---> 0
      this.all_colors[i] = Colors[Colors[i]];
    }

    // initialize toast
    $('.toast').toast({autohide: true, delay: 2000});

    // Notify Error to user if device tree is not loaded!
    if(this.deviceTreeData.availableDevices.length == 0){
      var modalRef = this.modalService.open(ModalDeviceTreeErrorComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      },);
    }
  }

  selectAll() {
    for (var i = 0; i < this.deviceTreeData.availableDevices.length; ++i) {
      this.deviceTreeData.availableDevices[i].selected = this.domain.name;
    }
  }

  unselectAll() {
    for (var i = 0; i < this.deviceTreeData.availableDevices.length; ++i) {
      this.deviceTreeData.availableDevices[i].selected = "";
    }
  }

  open_modal(domain_index: number = -1) {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(DomainsModalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      modalRef.componentInstance.domain = this.domain;
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
      });

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

  reload() {
    (<any>window).location.reload();
  }

  async addDomain() {

    var dn: Domain = <Domain>(await this.open_modal());
    console.log(dn);
    if (dn) {
      this.domain = dn;
    }
  }

  async modifyDomain(i: number) {

    var dn: Domain = <Domain>(await this.open_modal(i));
    console.log(dn);

    if (dn) {
      this.domain = dn;
    }
  }

  async deleteDomain(i: number) {
    // TODO
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

  AddColor(color: Colors) {
    if (this.domain.colors.indexOf(color) == -1) {
      this.domain.colors.push(color);
      this.domain.colors = this.domain.colors.sort(function (a, b) { return a - b });
    }
  }

  RemoveColor(color: Colors) {
    this.domain.colors = this.domain.colors.filter(data => data != color);
  }

  saveDomain() {
    var domains = (JSON.parse(localStorage.getItem("domains")));
    domains[this.domain.name] = this.domain;
    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("dts_data", this.deviceTreeData);

    $('.toast').toast('show');
  }

  selectDevice(device: Device){
    if(device.selected != this.domain.name){
      device.selected = this.domain.name;
    } else {
      device.selected = "";
    }
}

  isDeviceSelected(device: Device){
    return device.selected == this.domain.name;
  }
}
