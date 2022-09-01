import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  private _getData(key: string){
    return localStorage.getItem(key)
  }
  private _saveData(key: string, value: string){
    localStorage.setItem(key, value);
  }

  public saveData(key: string, value: object) {
    this._saveData(key, JSON.stringify(value));
  }

  public getData(key: string) {
    return JSON.parse(this._getData(key));
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
    
}
