import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'numberToBytes'
})
export class NumberToBytesPipe implements PipeTransform {

  constructor(
    private utils: UtilsService
  ){}

  transform(value: any, args?: any): any {
    return this.utils.formatBytes(value);
  }

}
