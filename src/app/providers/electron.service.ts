import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, shell } from 'electron';
import * as settings from 'electron-settings';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  shell: typeof shell;
  settings: typeof settings;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.shell = window.require('electron').shell;
      this.childProcess = window.require('child_process');
      this.settings = window.require('electron-settings');
      this.fs = window.require('fs');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  getAppWindow = () => {
    return remote.getCurrentWindow();
  }

  getAppSettings = () => {
    return settings;
  }

  isFirstLaunch(): boolean {
    return settings.get('AppSettings.isfirstLaunch');
  }

  setFirstTimeLaunch = $isfirsttime => {
    settings.set('AppSettings', {
      isfirstLaunch: $isfirsttime
    });
  }
}
