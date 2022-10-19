import { LocalstorageService } from "../services/localstorage.service";
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
    localMemory: LocalstorageService

    constructor(
        name: string = "",
        kernel: string = "",
        ramdisk: string = "",
        memory: number = -1,
        vcpus: number = 0,
        colors: Colors[] = [],
        passthrough_dtb: string = "",
        devices: Device[] = [],
        bootargs: string = ""
    ) {
        this.name = name;
        this.kernel = kernel;
        this.ramdisk = ramdisk;
        if (memory != -1) {
            this.memory = memory;
        } else {
            // gives default sane memory
            this.memory = 256 * 1024 * 1024;
        }
        this.vcpus = vcpus;
        this.colors = colors;
        this.passthrough_dtb = passthrough_dtb;
        this.devices = devices;
        this.bootargs = bootargs;
    }

}
