import { Colors } from "./colors.enum";
import { Device } from "./device";

export class Domain {

    name: string;
    kernel: string;
    ramdisk: string;
    memory: number;
    vcpus: number;
    colors: Colors[];
    passthrough_dtb: string;
    devices: Device[];
    bootargs: string;

    constructor(
        name: string = "",
        kernel: string = "",
        ramdisk: string = "",
        memory: number = 0,
        vcpus: number = 0,
        colors: Colors[] = [],
        passthrough_dtb: string = "",
        devices: Device[] = [],
        bootargs: string = ""
    ){
        this.name = name;
        this.kernel = kernel;
        this.ramdisk = ramdisk;
        this.memory = memory;
        this.vcpus = vcpus;
        this.colors = colors;
        this.passthrough_dtb = passthrough_dtb;
        this.devices = devices;
        this.bootargs = bootargs;
    }

}
