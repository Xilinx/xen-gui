import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.scss']
})
export class InfoboxComponent implements OnInit {
  @Input()
  color: string;

  @Input()
  title: string;

  @Input()
  value: string;

  @Input()
  icon: string;

  constructor() {}

  ngOnInit() {}
}
