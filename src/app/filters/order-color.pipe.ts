import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderColor'
})
export class OrderColorPipe implements PipeTransform {

  // if color is available as string
  transform(value: any, args?: any): any {
    return value.sort(function(a,b) { return parseInt(a) - parseInt(b)});
  }

}
