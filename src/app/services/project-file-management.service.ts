import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';

const { dialog } = require('electron').remote;
var fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class ProjectFileManagementService {

  constructor(
    private localmemory: LocalstorageService
  ) {

  }

  save(project_name: string) {
    if (project_name == "Untitled Xen Project") {
      this.saveAs();
      return;
    } else {
      this.localmemory.saveData("modified", false, false);
      var dump = this.localmemory.dump();
      fs.writeFileSync(project_name, JSON.stringify(dump, null, 4), 'utf-8');
    }
  }

  async saveAs() {
    this.localmemory.saveData("modified", false, false);
    var dump = this.localmemory.dump();
    var options = {
      title: "Save file",
      buttonLabel: "Save",

      filters: [
        { name: 'json', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    const result = await dialog.showSaveDialog(options);
    console.log('Save resolved:', result);
    const filePath = result;
    console.log('filePath -->', filePath);

    fs.writeFileSync(filePath, JSON.stringify(dump, null, 4), 'utf-8');

    this.localmemory.saveData("filename", filePath, false);

    return filePath;
  }

  hasToSave(){
    return this.localmemory.getData("modified");
  }

  async load() {
    var options = {
      title: "Load file",
      buttonLabel: "Load",
      filters: [
        { name: 'json', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    };

    const result = await dialog.showOpenDialog(options)[0];
    console.log('load resolved:', result);
    const filePath = result;
    console.log('filePath -->', filePath);

    var dump = fs.readFileSync(filePath);
    this.localmemory.loadDump(dump);
    this.localmemory.saveData("filename", filePath, false);

    <any>window.location.reload();
    //return filePath;

  }


}
