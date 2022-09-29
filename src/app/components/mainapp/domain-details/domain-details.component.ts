import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../app.component';
import { Colors } from '../../../models/colors.enum';
import { Device } from '../../../models/device';
import { DeviceTree } from '../../../models/device-tree';
import { Domain } from '../../../models/domain';
import { ColorsManagementService } from '../../../services/colors-management.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { MemoryManagementService } from '../../../services/memory-management.service';
import { VcpusManagementService } from '../../../services/vcpus-management.service';
import { DomainsModalComponent } from '../modals/domains-modal/domains-modal.component';
import { ModalDeleteDomainComponent } from '../modals/modal-delete-domain/modal-delete-domain.component';
import { ModalDeviceTreeErrorComponent } from '../modals/modal-device-tree-error/modal-device-tree-error.component';
import { ModalEnableManualCacheColoringComponent } from '../modals/modal-enable-manual-cache-coloring/modal-enable-manual-cache-coloring.component';


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
  manual_cache_coloring_enabled: boolean = false;
  is_cache_coloring_enabled: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private localmemory: LocalstorageService,
    private colorsManager: ColorsManagementService,
    private vcpusManager: VcpusManagementService,
    private ref: ChangeDetectorRef,
    private memoryManager: MemoryManagementService,
    private appComponent: AppComponent,
    private zone: NgZone
  ) {
  }

  reloadDomain() {
    var name = this.domain.name;
    var domains = this.localmemory.getData("domains");
    this.domain = <Domain>domains[name];
  }

  private loadDomains(): Domain[] {
    var localmemory_domains = this.localmemory.getData("domains");
    var domains: Domain[] = [];
    // transform object of objects into array of object
    for (var key in localmemory_domains) {
      if (key != "DOM0" && key != "Xen") {
        domains.push(localmemory_domains[key]);
      }
    }
    return domains;
  }


  ngOnInit() {
    this.is_cache_coloring_enabled = this.localmemory.getData("cache_coloring_enabled") || false;

    this.deviceTreeData = this.localmemory.getData("dts_data");
    if (!this.deviceTreeData || this.deviceTreeData.availableDevices.length == 0) {
      // Notify Error to user if device tree is not loaded!
      // dummy device tree for avoiding frontend errors
      this.deviceTreeData = new DeviceTree();
      var modalRef = this.modalService.open(ModalDeviceTreeErrorComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      },);
    } else {
      var sub = this.route.params.subscribe(params => {
        var domains = this.localmemory.getData("domains");
        this.domain = <Domain>domains[params['name']];
      });
      console.log(this.domain.name);
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
      $('.toast').toast({ autohide: true, delay: 2000 });

    }
  }

  selectAll() {
    for (var i = 0; i < this.deviceTreeData.availableDevices.length; ++i) {
      this.deviceTreeData.availableDevices[i].selected = this.domain.name;
      this.domain.devices.push(this.deviceTreeData.availableDevices[i]);
    }
  }

  unselectAll() {
    for (var i = 0; i < this.deviceTreeData.availableDevices.length; ++i) {
      this.deviceTreeData.availableDevices[i].selected = "";
      this.domain.devices.pop();
    }
  }

  open_modal(modalComponent: any = DomainsModalComponent) {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(modalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
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

  async modifyDomain() {

    var old_dn = this.domain;
    var dn: Domain = <Domain>(await this.open_modal());
    console.log(dn);

    if (dn) {
      this.domain = dn;

      //reassign vpcus (remove)
      this.vcpusManager.removeCpus(old_dn.name);
      //reassign memory (remove)
      this.memoryManager.removeMemory(old_dn.name);

      var domains = this.localmemory.getData("domains");
      delete domains[old_dn.name];
      domains[this.domain.name] = this.domain;
      this.localmemory.saveData("domains", domains);

      //reassign vpcus (add)
      this.vcpusManager.assignVcpus(dn.name, dn.vcpus);
      //reassign memory (add)
      this.memoryManager.assignMemory(dn.name, dn.memory);

      //reassign colors
      this.colorsManager.autoRemoveColors(this.domain.name);
      this.colorsManager.autoAssignColor(this.domain.name, this.domain.memory);

      // autosave
      this.saveDomain();

      //this.reload();
      this.reloadDomain();

      var domains_array = [];
      // transform object of objects into array of object
      for (var key in domains) {
        if (key != "DOM0" && key != "Xen") {
          domains_array.push(domains[key]);
        }
      }

      this.appComponent.updateDomainsMenu(domains_array);
      this.ref.detectChanges();

      //this.router.navigate(["domains/" + this.domain.name]);
    }
  }

  async deleteDomain() {
    var confirm = <Domain>(await this.open_modal(ModalDeleteDomainComponent));

    if (confirm) {
      var domain_name = this.domain.name;

      // free colors
      this.colorsManager.autoRemoveColors(domain_name);
      // free vcpus
      this.vcpusManager.removeCpus(domain_name);
      // free memory
      this.memoryManager.removeMemory(domain_name);

      var domains = this.localmemory.getData("domains");
      delete domains[domain_name];

      this.localmemory.saveData("domains", domains);

      this.appComponent.updateDomainsMenu(this.loadDomains());
      this.ref.detectChanges();

      // return to domains
      this.zone.run(() => {
        this.router.navigate(["domains"]);
      });
    }

  }

  colorLabel(c: Colors, check_if_free: boolean = false, cursor: string = ""): object {
    var style: any;
    style = { "background-color": "" + Colors[c] };
    if (c > Colors.lightblue)
      style["color"] = "white";
    else
      style["color"] = "black";

    if (check_if_free) {
      if (this.colorsManager.getFreeColors().indexOf(c) == -1) {
        style["opacity"] = 0.5;
      }
    }
    if (cursor) {
      if (check_if_free) {
        if (this.colorsManager.getFreeColors().indexOf(c) == -1) {
          style["cursor"] = "not-allowed";
        } else {
          style["cursor"] = cursor;
        }
      } else {
        style["cursor"] = cursor;
      }
    }

    return style;
  }

  AddColor(color: Colors) {
    if (this.domain.colors.indexOf(color) == -1) {
      /*
      this.domain.colors.push(color);
      this.domain.colors = this.domain.colors.sort(function (a, b) { return a - b });
      */
      this.colorsManager.autoAssignColor(this.domain.name, -1, color);
    }

    // autosave
    //this.saveDomain();

    this.reloadDomain();
  }

  RemoveColor(color: Colors) {
    //this.domain.colors = this.domain.colors.filter(data => data != color);
    this.colorsManager.autoRemoveColors(this.domain.name, color);
    // autosave
    //this.saveDomain();

    this.reloadDomain();
  }

  saveDomain(domains: [Domain] = null) {
    if (domains == null) {
      domains = this.localmemory.getData("domains");
    }
    domains[this.domain.name] = this.domain;
    this.localmemory.saveData("domains", domains);
    this.localmemory.saveData("dts_data", this.deviceTreeData);

    //reassign colors
    this.colorsManager.autoRemoveColors(this.domain.name);
    this.colorsManager.autoAssignColor(this.domain.name, this.domain.memory);

    $('.toast').toast('show');
  }

  selectDevice(device: Device) {
    var domains: [Domain] = this.localmemory.getData("domains");

    if (device.selected != this.domain.name) {
      if (device.selected != "") {
        var deviceIndex = domains[device.selected].devices.findIndex(object => {
          return object.name === device.name;
        });

        domains[device.selected].devices.splice(deviceIndex, 1);
      }
      device.selected = this.domain.name;
      this.domain.devices.push(device);

    } else {
      var deviceIndex = this.domain.devices.findIndex(object => {
        return object.name === device.name;
      });
      device.selected = "";
      this.domain.devices.splice(deviceIndex, 1);
    }

    // autosave
    this.saveDomain(domains);

  }

  isDeviceSelected(device: Device) {
    return device.selected == this.domain.name;
  }

  returnToDomains() {
    this.router.navigate(["domains"]);
  }

  async enable_manual_cache_coloring(isChecked) {
    if (isChecked) {
      this.manual_cache_coloring_enabled = false;
      this.manual_cache_coloring_enabled = <boolean>await this.open_modal(ModalEnableManualCacheColoringComponent);
    }
  }
}
