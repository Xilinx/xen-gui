import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-warning-reset-session',
  templateUrl: './modal-warning-reset-session.component.html',
  styleUrls: ['./modal-warning-reset-session.component.scss']
})
export class ModalWarningResetSessionComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  close(confirm: boolean){
    this.modalService.dismissAll(confirm);
  }  
}
