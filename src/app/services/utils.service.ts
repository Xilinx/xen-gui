import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  waitSeconds(s: number){
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, s);
    }) 
  }
}
