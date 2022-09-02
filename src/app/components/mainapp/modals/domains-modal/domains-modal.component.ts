import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { Domain } from '../../../../models/domain';
import { Options, LabelType,  } from '@angular-slider/ngx-slider';
import { UtilsService } from '../../../../services/utils.service';
import { DeviceTree } from '../../../../models/device-tree';
import { LocalstorageService } from '../../../../services/localstorage.service';
import { Colors } from '../../../../models/colors.enum';

@Component({
  selector: 'app-domains-modal',
  templateUrl: './domains-modal.component.html',
  styleUrls: ['./domains-modal.component.scss']
})
export class DomainsModalComponent implements OnInit, AfterViewInit {

  @Input() public domain: Domain;
  @ViewChild("domainForm") domainForm: NgForm;
  @ViewChild("mem_slider") mem_slider: ElementRef;
  @ViewChild("vcpus_slider") vcpus_slider: ElementRef;

  deviceTreeData: DeviceTree;

  memory_options: Options = {
    floor: 0,
    ceil: 4096,
    showSelectionBar: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return  this.utils.formatBytes(value);//'0x'+ ('00000000' + value.toString(16).toUpperCase()).slice(-8);
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
    private localmemory: LocalstorageService
  ){
    
  }

  ngOnInit(){
    this.deviceTreeData = this.localmemory.getData("dts_data");
    var memsize = 0;
    for(var i = 0; i < this.deviceTreeData.memories.length; ++i){
      memsize += this.deviceTreeData.memories[i].size;
    }
    this.memory_options.ceil = memsize;
    this.vcpus_options.ceil = this.deviceTreeData.numberOfCPUs;
  }

  ngAfterViewInit() {
    console.log(this.domain);
    // workaround for setting patchValue in async way
    setTimeout(()=>{
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

  onSubmit(domainForm: NgForm){
    if(domainForm.valid){
      this.domain = <Domain>(this.utils.patchValues(this.domain, domainForm.value));

      this.modalService.dismissAll(this.domain);
    }
  }

  close(){
    this.modalService.dismissAll(null);
  }

  ngOnView

}
