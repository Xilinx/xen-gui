import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-success-saving',
  templateUrl: './modal-success-saving.component.html',
  styleUrls: ['./modal-success-saving.component.scss']
})
export class ModalSuccessSavingComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  close(confirm: boolean){
    this.modalService.dismissAll(confirm);
  }  
}
