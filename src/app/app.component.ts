import { Component, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { fadeAnimation } from '../app/app.animations';
import { LocalstorageService } from './services/localstorage.service';
import { Domain } from './models/domain';
import { Route, Router } from '@angular/router';
import { DeviceTree } from './models/device-tree';
import { Colors } from './models/colors.enum';
import { ColorsManagementService } from './services/colors-management.service';


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
    private localmemory: LocalstorageService,
    private route: Router,
    private colorManager: ColorsManagementService
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
    if (this.localmemory.getData("domains") == null) {
      console.log("reconstructing Local Storage...");
      /*
      var _colors: Colors[] = [];
      for(var i = 0; i < Colors.END; ++i){
        _colors.push(i);
      }
      */

     this.colorManager.Reset();      

     //TODO: autocpus
      var dom0_default_memory = 1024 * 1024 * 1024; // 1G
      var dom0 : Domain = new Domain(
        "DOM0",
        "xen",
        "dom0-ramdisk.cpio",
        dom0_default_memory,
        0,
        [],
        "",
        [],
        "console=hvc0 earlycon=xen earlyprintk=xen clk_ignore_unused root=/dev/ram0"
      );

      this.localmemory.saveData("domains", {
        "DOM0": dom0
      });

      // autoassign colors for dom0
      this.colorManager.AutoAssignColor("DOM0", dom0_default_memory);      

      this.localmemory.saveData("dts_data", new DeviceTree());
      this.localmemory.saveData("dts_json", {});
      this.route.navigate(["read-device-tree"]);
    }
  }

  ngOnInit(): void {
    this.appTitle = 'Configurator';
    this.setupResizer();
  }

  setupResizer() {
    $(window).resize(function () {
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
    this.localmemory.clearData();
    <any>(window).location.reload();
  }
}
