import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../models/device';

@Pipe({
  name: 'deviceTypeFilter'
})
export class DeviceTypeFilterPipe implements PipeTransform {

  transform(items: Device[], filter: string): any {
    console.log(items);
    console.log("filtered by " + filter);
    return items.filter(item => item.type.indexOf(filter) !== -1);
  }

}
