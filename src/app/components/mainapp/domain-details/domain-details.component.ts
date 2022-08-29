import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceTypeFilterPipe } from '../../../filters/device-type-filter.pipe';
import { Colors } from '../../../models/colors.enum';
import { DeviceTree } from '../../../models/device-tree';
import { Domain } from '../../../models/domain';
import { DomainsModalComponent } from '../modals/domains-modal/domains-modal.component';

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

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    ) { 

    }

  ngOnInit() {
    var sub = this.route.params.subscribe(params => {
     this.domain.name = params['name'];
     });
     console.log(this.domain.name);
     this.deviceTreeData = JSON.parse(localStorage.getItem("dts_data"));
     console.log(this.deviceTreeData);
      // enable tooltips everywhere
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      });
   }

   selectAll(){
    for(var i = 0; i < this.deviceTreeData.availableDevices.length; ++i){
      this.deviceTreeData.availableDevices[i].selected = true;
    }
   }

   unselectAll(){
    for(var i = 0; i < this.deviceTreeData.availableDevices.length; ++i){
      this.deviceTreeData.availableDevices[i].selected = false;
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

      this.domain = dn;
    }
  }

  async modifyDomain(i: number) {

    var dn: Domain = <Domain>(await this.open_modal(i));
    console.log(dn);

    if (dn) {
      var colors: Colors[] = [];
      for (var i = 0; i < 4; i++) {
        colors.push(this.tmp_color);
        this.tmp_color = (this.tmp_color + 1) % 16;
      }

      dn.colors = colors;
      this.domain = dn;

    }
  }

  async deleteDomain(i: number){
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


}
