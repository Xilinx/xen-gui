import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-enable-manual-cache-coloring',
  templateUrl: './modal-enable-manual-cache-coloring.component.html',
  styleUrls: ['./modal-enable-manual-cache-coloring.component.scss']
})
export class ModalEnableManualCacheColoringComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  close(confirm: boolean){
    this.modalService.dismissAll(confirm);
  }

}
