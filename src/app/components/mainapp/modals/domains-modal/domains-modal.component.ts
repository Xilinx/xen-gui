import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { Domain } from '../../../../models/domain';
import { Options, LabelType, } from '@angular-slider/ngx-slider';
import { UtilsService } from '../../../../services/utils.service';
import { DeviceTree } from '../../../../models/device-tree';
import { LocalstorageService } from '../../../../services/localstorage.service';
import { Colors } from '../../../../models/colors.enum';
import { VcpusManagementService } from '../../../../services/vcpus-management.service';
import { MemoryManagementService } from '../../../../services/memory-management.service';

@Component({
  selector: 'app-domains-modal',
  templateUrl: './domains-modal.component.html',
  styleUrls: ['./domains-modal.component.scss']
})
export class DomainsModalComponent implements OnInit, AfterViewInit {

  @Input() public domain: Domain;
  @ViewChild("domainForm", {static: false}) domainForm: NgForm;
  @ViewChild("mem_slider", {static: false}) mem_slider: ElementRef;
  @ViewChild("vcpus_slider", {static: false}) vcpus_slider: ElementRef;

  deviceTreeData: DeviceTree;
  available_vcpus: number;
  available_memory: number;

  memory_options: Options = {
    floor: 0,
    ceil: 4096,
    step: 128 * 1024 * 1024,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return this.utils.formatBytes(value);//'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
        case LabelType.High:
          return this.utils.formatBytes(value); //'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
        default:
          return this.utils.formatBytes(value).replace("Bytes", "");//'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
      }
    }

  }

  vcpus_options: Options = {
    floor: 0,
    ceil: 4,
    step: 1,
    showTicks: true,
    showTicksValues: false,
    showSelectionBar: true,
  }

  constructor(
    private modalService: NgbModal,
    private utils: UtilsService,
    private localmemory: LocalstorageService,
    private vcpusManager: VcpusManagementService,
    private memoryManager: MemoryManagementService
  ) {

  }

  ngOnInit() {
    this.deviceTreeData = this.localmemory.getData("dts_data");
    var scheduler = this.localmemory.getData("scheduler");
    if (scheduler == "null") {
      this.available_vcpus = this.vcpusManager.getAvailableVcpus() + this.domain.vcpus;
    } else {
      this.available_vcpus = this.vcpusManager.getAvailableVcpus();
    }
    this.available_memory = this.memoryManager.getAvailableMemory() + this.domain.memory;

    if (this.domain.vcpus == 0) {
      this.domain.vcpus = 1;
    }
    if (this.domain.memory == 0) {
      this.domain.memory = 256 * 1024 * 1024;
    }

    this.memory_options.ceil = this.available_memory;
    this.vcpus_options.ceil = this.available_vcpus;
  }

  ngAfterViewInit() {
    console.log(this.domain);
    // workaround for setting patchValue in async way
    setTimeout(() => {
      this.domainForm.form.patchValue(this.domain);
      console.log(this.domainForm.value);
    },);

    (<any>(this.mem_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${this.utils.formatBytes(this.domain.memory)}</span></div>`;
    (<any>(this.vcpus_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${this.domain.vcpus}</span></div>`;
  }

  onChangeSliderMem(obj) {
    (<any>(this.mem_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${this.utils.formatBytes(obj.value)}</span></div>`;
  }
  onChangeSliderVcpus(obj) {
    (<any>(this.vcpus_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${obj.value}</span></div>`;
  }

  onSubmit(domainForm: NgForm) {
    if (domainForm.valid && this.domain.vcpus > 0) {
      this.domain = <Domain>(this.utils.patchValues(this.domain, domainForm.value));

      this.modalService.dismissAll(this.domain);
    }
  }

  close() {
    this.modalService.dismissAll(null);
  }

  ngOnView

}
