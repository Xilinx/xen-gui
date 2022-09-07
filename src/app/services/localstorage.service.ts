import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  private _getData(key: string) {
    return localStorage.getItem(key)
  }
  private _saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public saveData(key: string, value: any, store_modified: boolean = true) {
    this._saveData(key, JSON.stringify(value));
    if (store_modified) {
      this._saveData("modified", JSON.stringify(true));
    }
  }

  public getData(key: string) {
    return JSON.parse(this._getData(key));
  }

  public dump(){
    return localStorage;
  }

  public loadDump(dump){
    var d = JSON.parse(dump);
    console.log(d);
    
    for(var key in d){
      this._saveData(key, d[key]);
    }
    
  }

  public removeData(key: string, store_modified: boolean = true) {
    localStorage.removeItem(key);
    if (store_modified) {
      this._saveData("modified", JSON.stringify(true));
    }
  }

  public clearData() {
    localStorage.clear();
  }

}
