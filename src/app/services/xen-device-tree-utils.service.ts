import { Injectable } from '@angular/core';
import { DeviceTree } from '../models/device-tree';
import { parse } from 'yamljs';
import { map } from 'rxjs/operators';
import { Memory } from '../models/memory';
import { Device } from '../models/device';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class XenDeviceTreeUtilsService {

  constructor() { }

  public readDTSString(s: string): { data: DeviceTree, json: {} } {
    var deviceTreeJson = {};
    var deviceTreeData: DeviceTree = new DeviceTree();
    var tmp = s;
    tmp = tmp.replace(/\/dts.*\/;/g, "");
    tmp = tmp.replace(/\/include.*/g, "");
    // multiline style-C comments
    tmp = tmp.replace(/\/\*(?:(?!\*\/).)*\*\/\n?/sg, "\n");
    // multiline fields
    tmp = tmp.replace(/,[\r\n]+[\t]*[ ]*/gm, ", ");
    tmp = tmp.replace(/};/g, "");
    tmp = tmp.replace(/[ ]*{[ ]*[\r\n]+/gm, ":\n");
    tmp = tmp.replace(/=/g, ":");
    //tmp = tmp.replace(/</g, "[");
    //tmp = tmp.replace(/>/g, "]");
    tmp = tmp.replace(/\t/g, "    ");
    tmp = tmp.replace(/\r/g, '\n');

    tmp = tmp.replace(/#/g, '_');

    var check = tmp.split(/\n/);

    for (var i = 0; i < check.length; i++) {

      // if is a comment
      if (check[i].indexOf("//") >= 0) {
        check[i] = "";
      }

      // if there is an angular array
      if (check[i].indexOf("<") >= 0 || check[i].indexOf(">") >= 0) {
        var check_left = check[i].split("<")[0];
        var check_right = check[i].split("<")[1];
        check_right = check_right.replace(/[ ]+/g, ",");
        check[i] = check_left + "<" + check_right;
        check[i] = check[i].replace("<", "[");
        check[i] = check[i].replace(">", "]");
      }

      // if there is a terminator character
      if (check[i].indexOf(";") >= 0) {
        check[i] = check[i].replace(/;/g, "");
        // if there is a terminator character BUT the attribute is empty
        if (check[i].indexOf(":") < 0) {
          check[i] = check[i].substring(0, check[i].length) + ": \"\"";
        }
      }

      // if there is an array but is not group by square parenthesis
      if (check[i].indexOf(":") >= 0 && check[i].indexOf(",") >= 0 && check[i].match(/\"/g) && check[i].match(/\"/g).length > 2 && (check[i].indexOf("[") < 0 || check[i].indexOf("]") < 0)) {
        var index = check[i].indexOf(":");
        check[i] = check[i].substring(0, index + 1) + " [" + check[i].substring(index + 2, check[i].length) + " ]";

      }

      // if is an array without comma
      if (check[i].indexOf("[") >= 0 && check[i].indexOf("]") >= 0 && check[i].indexOf(",") < 0) {
        var index_s = check[i].indexOf("[");
        var index_e = check[i].indexOf("]");
        var _s = check[i].substring(index_s + 1, index_e + 1);
        _s = _s.replace(/ /g, ",");
        check[i] = check[i].substring(0, index_s + 1) + _s;
      }

      // "code" tag not supported
      if (check[i].match(/code( )*:( )*\"/g)) {
        while (!check[i].match(/\";/gs)) {
          check[i] = "";
          i++;
        }
        check[i] = "";
      }

    }

    var tmp2 = check.join("\n");

    // convert YAML to JSON
    deviceTreeJson = parse(tmp2);

    deviceTreeData = new DeviceTree();

    // count the number of cpus (how many cpu entry in devicetree)
    deviceTreeData.numberOfCPUs = 0;
    for (const [key, value] of Object.entries(deviceTreeJson["/"].cpus)) {
      if (key.indexOf("cpu") >= 0) {
        deviceTreeData.numberOfCPUs++;
      }
    }

    // extract memory data
    const chunkSize = 4;
    const address_cells = parseInt(deviceTreeJson["/"]["_address-cells"][0]);
    const size_cells = parseInt(deviceTreeJson["/"]["_size-cells"][0]);
    if (deviceTreeJson["/"].hasOwnProperty("memory")) {
      var reg = deviceTreeJson["/"].memory.reg;
      var i = 0;
      while (i < reg.length) {
        var _size: bigint = BigInt(0);
        var _address: bigint = BigInt(0);
        if (address_cells == 2)
          _address = (BigInt(reg[i]) << BigInt(32)) | BigInt(reg[i + 1]);
        else
          _address = BigInt(reg[i]);

        i += address_cells;

        if (size_cells == 2)
          _size = BigInt(((BigInt(reg[i])) << BigInt(32)) | BigInt(reg[i + 1]));
        else
          _size = BigInt(reg[i]);

        i += size_cells;

        deviceTreeData.numberOfMemories++;
        deviceTreeData.memories.push(new Memory(Number(_address), Number(_address + _size), Number(_size)));
      }

    }

    // count number of devices and save device name
    deviceTreeData.numberOfAvailableDevices = 0;
    if (deviceTreeJson["/"].hasOwnProperty("amba") || deviceTreeJson["/"].hasOwnProperty("axi")) {
      var dd = deviceTreeJson["/"].amba ? deviceTreeJson["/"].amba : deviceTreeJson["/"].axi;
      for (const [key, value] of Object.entries(dd)) {
        if (dd[key].hasOwnProperty("status")) {
          // check if has label (key contains ":")
          var label = "";
          var name = "";
          var address = 0;
          if (key.split(":").length > 1) {
            label = key.split(":")[0];
            name = key.split(":")[1].split("@")[0];
            address = parseInt(key.split(":")[1].split("@")[1], 16);
          }
          else {
            label = "";
            name = key.split("@")[0];
            address = parseInt(key.split("@")[1], 16);
          }
          if (dd[key].status != "disabled") {
            deviceTreeData.numberOfAvailableDevices++;
            deviceTreeData.availableDevices.push(new Device(name, address));
          } else {
            deviceTreeData.disabledDevices.push(new Device(name, address));
          }
        }
      }
    }

    deviceTreeData.availableDevices.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    deviceTreeData.disabledDevices.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    // convert big number in hex format
    var dd = deviceTreeJson["/"];
    dd = Object.keys(dd).reduce(function sanitizeBooleanStructureRecursively(collector, key) {
      var
        source = collector.source,
        target = collector.target,
        value = source[key],
        str
        ;
      if (value && (typeof value == "object")) {
        value = Object.keys(value).reduce(sanitizeBooleanStructureRecursively, {
          source: value,
          target: {}
        }).target;
      } else if (typeof value == "number") {
        value = "0x" + value.toString(16);
      }
      target[key] = value;
      return collector;
    }, {
      source: dd,
      target: {}
    }).target;
    deviceTreeJson["/"] = dd;

    return { "data": deviceTreeData, "json": deviceTreeJson };
  }

}
