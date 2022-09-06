import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Domain } from '../../../../models/domain';

@Component({
  selector: 'app-modal-delete-domain',
  templateUrl: './modal-delete-domain.component.html',
  styleUrls: ['./modal-delete-domain.component.scss']
})
export class ModalDeleteDomainComponent implements OnInit {

  @Input() public domain: Domain;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  close(confirm: boolean){
    this.modalService.dismissAll(confirm);
  }

}
