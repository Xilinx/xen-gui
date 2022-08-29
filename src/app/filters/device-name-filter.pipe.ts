import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../models/device';

@Pipe({
  name: 'deviceNameFilter'
})
export class DeviceNameFilterPipe implements PipeTransform {

  transform(items: Device[], filter: string): any {
    console.log(items);
    console.log("filtered by " + filter);
    return items.filter(item => item.name.indexOf(filter) !== -1);
  }

}
