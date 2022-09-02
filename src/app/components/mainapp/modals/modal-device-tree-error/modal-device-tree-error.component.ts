import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-device-tree-error',
  templateUrl: './modal-device-tree-error.component.html',
  styleUrls: ['./modal-device-tree-error.component.scss']
})
export class ModalDeviceTreeErrorComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }
  close(){
    this.modalService.dismissAll(null);
  }
}
