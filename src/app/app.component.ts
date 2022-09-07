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
import { VcpusManagementService } from './services/vcpus-management.service';
import { ModalWarningResetSessionComponent } from './components/mainapp/modals/modal-warning-reset-session/modal-warning-reset-session.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectFileManagementService } from './services/project-file-management.service';
import { ImagebuilderFileManagementService } from './services/imagebuilder-file-management.service';

const os = require('os');
var path = require('path'),
  fs = require('fs');

function fromDir(startPath, filter) {

  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter); //recurse
    } else if (filename.endsWith(filter)) {
      console.log('-- found: ', filename);
    };
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

  ourApp: Electron.BrowserWindow;
  appTitle: string;
  username: string;
  domains: Domain[] = [];
  current_project_name: string = "Untitled Xen Project";


  constructor(
    public elSvc: ElectronService,
    private translate: TranslateService,
    private localmemory: LocalstorageService,
    private route: Router,
    private modalService: NgbModal,
    public projectFileManager: ProjectFileManagementService,
    private imageBuilderFileManager: ImagebuilderFileManagementService
  ) {
    this.username = os.userInfo().username;

    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (elSvc.isElectron()) {
      this.ourApp = elSvc.getAppWindow();
    }

    //////////////////////////////////////////////////////////////
    // if localstorage is empty, create one in read device tree!
    //////////////////////////////////////////////////////////////
    /*
 
    localstorage
    |
    |--colors ---> available colors
    |--vcpus ---> available vcpus
    |--domains
    |     |--dom0: Domain obj ---> Domain
    |     |-- ...
    |     |--domN: Domain obj
    |--dts_data ---> DeviceTree
    |--dts_json ---> DeviceTree converted dts->yaml->json
    */
    if (this.localmemory.getData("domains") == null) {
      console.log("need to reconstruct Local Storage");
      this.route.navigate(["read-device-tree"]);
    } else {
      this.loadDomains();
      if (this.localmemory.getData("filename")) {
        this.current_project_name = this.localmemory.getData("filename");
      }
    }
  }

  isActive(instruction: any[]): boolean {
    //console.log(this.route.url + " [" + instruction +"]"  +" "+ (this.route.url.indexOf(instruction[0]) != -1 && this.route.url.indexOf(instruction[1]) != -1));
    // Set the second parameter to true if you want to require an exact match.
    return this.route.url.indexOf(instruction[0]) != -1 && this.route.url.indexOf(instruction[1]) != -1;
  }

  private loadDomains() {
    var lc_domains = this.localmemory.getData("domains");
    this.domains = [];
    // transform object of objects into array of object
    for (var key in lc_domains) {
      if (key != "DOM0" && key != "Xen") {
        this.domains.push(lc_domains[key]);
      }
    }
  }


  ngOnInit(): void {
    this.appTitle = 'Configurator';
    this.setupResizer();
  }

  updateDomainsMenu(domains: Domain[]) {
    this.domains = domains;
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

  open_modal(modalComponent: any = ModalWarningResetSessionComponent) {
    return new Promise((resolve, reject) => {
      const modalRef = this.modalService.open(modalComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      modalRef.result.then((result) => {
        resolve(result);
      }, (reason) => {
        resolve(reason);
      });
      // workaround for avoiding modal flickering
      setTimeout(() => {
        <any>(document).getElementsByClassName("modal fade show")[0].classList.add("blink");
      });

    });

  }

  async openProject() {
    await this.projectFileManager.load();
  }

  async saveProject() {
    this.current_project_name = await this.projectFileManager.save(this.current_project_name);
  }

  async saveProjectAs() {
    this.current_project_name = await this.projectFileManager.saveAs();
  }

  async saveImageBuilder(){
    this.imageBuilderFileManager.saveAs();    
  }

  async logout() {
    var confirm = await this.open_modal();
    if (confirm) {
      this.localmemory.clearData();
      <any>(window).location.reload();
    }
  }

}
