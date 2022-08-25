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

  /*
  patch values from target "target" and replace with value of "src"
  if src has other keys, they will be ignored
    ex:
    var foo = { 'a': 0, 'b': 1 }
    var bar = { 'b': 2, 'c': 3 }
    patchValues(foo, bar)

    ---> 
    {
      "a": 0,
      "b": 2
    }
  */
  patchValues(target, src) {
    const res = {};
    Object.keys(target)
        .forEach(k => res[k] = (src.hasOwnProperty(k) ? src[k] : target[k]));
    return res;
  }
  
}
