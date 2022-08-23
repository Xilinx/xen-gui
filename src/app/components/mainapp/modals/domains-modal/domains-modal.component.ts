import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NgForm } from '@angular/forms';
import { Domain } from '../../../../models/domain';

@Component({
  selector: 'app-domains-modal',
  templateUrl: './domains-modal.component.html',
  styleUrls: ['./domains-modal.component.scss']
})
export class DomainsModalComponent implements OnInit, AfterViewInit {

  @Input() public domain: Domain;
  @ViewChild("domainForm") domainForm: NgForm;

  constructor(
    private modalService: NgbModal
  ){
    
  }

  ngOnInit(){

  }

  ngAfterViewInit() {
    console.log(this.domain);
    // workaround for setting patchValue in async way
    setTimeout(()=>{
      this.domainForm.form.patchValue(this.domain);
    },)
  }

  onSubmit(domainForm: NgForm){
    if(domainForm.valid){
      this.modalService.dismissAll(domainForm.value);
    }
  }

  close(){
    this.modalService.dismissAll(null);
  }

  ngOnView

}
