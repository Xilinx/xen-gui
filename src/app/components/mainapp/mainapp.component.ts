import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../app.animations';

@Component({
  selector: 'app-mainapp',
  templateUrl: './mainapp.component.html',
  styleUrls: ['./mainapp.component.scss'],
  animations: [fadeAnimation]
})
export class MainappComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
