import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { fadeAnimation } from '../app/app.animations';
import { LocalstorageService } from './services/localstorage.service';
import { Domain } from './models/domain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  ourApp: Electron.BrowserWindow;
  appTitle: string;

  constructor(
    public elSvc: ElectronService,
    private translate: TranslateService,
    private localStorage: LocalstorageService
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (elSvc.isElectron()) {
      this.ourApp = elSvc.getAppWindow();
    }

    //////////////////////////////////////////
    // if localstorage is empty, create one!
    //////////////////////////////////////////
    /*

    localstorage
    |
    |--domains
    |     |--dom0: Domain obj ---> Domain
    |     |-- ...
    |     |--domN: Domain obj
    |--dts_data ---> DeviceTree
    |--dts_json ---> DeviceTree converted dts->yaml->json

    */
    if(localStorage.getData("domains") == null){
      console.log("reconstructing Local Storage...");
      localStorage.saveData("domains", JSON.stringify( {"DOM0": new Domain("DOM0")} ));
    }
  }

  ngOnInit(): void {
    this.appTitle = 'Configurator';
    this.setupResizer();
  }

  setupResizer() {
    $(window).resize(function() {
      const width = $(window).width();
      const hasClass = $('body').hasClass('sidebar-collapse');

      if (width <= 850) {
        if (hasClass !== true) {
          $('body').addClass('sidebar-collapse');
        }
      } else {
        if (hasClass === true) {
          $('body').removeClass('sidebar-collapse');
        }
      }
    });
  }

  logout() {
    this.localStorage.clearData();
    <any>(window).location.reload();
  }
}
