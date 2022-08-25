import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { Domain } from '../../../../models/domain';
import { Options, LabelType,  } from '@angular-slider/ngx-slider';
import { UtilsService } from '../../../../services/utils.service';

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

  memory_options: Options = {
    floor: 0,
    ceil: 4096,
    showSelectionBar: true,
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
    private utils: UtilsService
  ){
    
  }

  ngOnInit(){

  }

  ngAfterViewInit() {
    console.log(this.domain);
    // workaround for setting patchValue in async way
    setTimeout(()=>{
      this.domainForm.form.patchValue(this.domain);
      console.log(this.domainForm.value);
    },);

    (<any>(this.mem_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${this.domain.memory}</span></div>`;
    (<any>(this.vcpus_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${this.domain.vcpus}</span></div>`;
  }

  onChangeSliderMem(obj) {
    (<any>(this.mem_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${obj.value}</span></div>`;
  }
  onChangeSliderVcpus(obj) {
    (<any>(this.vcpus_slider)).elementRef.nativeElement.querySelector("span.ngx-slider-span.ngx-slider-pointer.ngx-slider-pointer-min").innerHTML = `<div><span>${obj.value}</span></div>`;
  }

  onSubmit(domainForm: NgForm){
    if(domainForm.valid){
      this.domain = <Domain>(this.utils.patchValues(this.domain, domainForm.value));
      console.log(this.domain);
      this.modalService.dismissAll(this.domain);
    }
  }

  close(){
    this.modalService.dismissAll(null);
  }

  ngOnView

}
