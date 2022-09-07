import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-device-tree-error',
  templateUrl: './modal-device-tree-error.component.html',
  styleUrls: ['./modal-device-tree-error.component.scss']
})
export class ModalDeviceTreeErrorComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
  }
  close(){
    this.modalService.dismissAll(null);
    this.router.navigate(["read-device-tree"]);

  }
}
