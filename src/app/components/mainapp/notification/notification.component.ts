import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnChanges {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  init() {}
}
