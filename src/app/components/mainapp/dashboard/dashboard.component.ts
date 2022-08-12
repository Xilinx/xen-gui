import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
declare let jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private elsService: ElectronService) {}

  ngOnInit() {
    this.init();

    $(window).resize(function() {
      jQuery('#myBox').css(
        'max-height',
        $(window).height() - $('.main-header').height() - 140
      );
    });
  }

  init() {
    jQuery('#myBox').css(
      'max-height',
      $(window).height() - $('.main-header').height() - 140
    );
  }
}
