import { Component, OnInit, Input } from '@angular/core';
import { BrowserWindow } from 'electron';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  @Input() title: String;

  @Input() appwindow: BrowserWindow;

  buttonText: 'Maximize' | 'Restore Down';

  constructor() {}

  ngOnInit() {
    this.buttonText = 'Maximize';
  }

  minimize() {
    this.appwindow.minimize();
  }

  close() {
    this.appwindow.close();
  }

  maximizeOrRestore() {
    !this.appwindow.isMaximized() ? this.max() : this.res();
  }

  private max() {
    this.appwindow.maximize();
    this.buttonText = 'Restore Down';
  }

  private res() {
    this.appwindow.restore();
    this.buttonText = 'Maximize';
  }
}
