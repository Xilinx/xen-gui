import { Colors } from "./colors.enum";

export class Domain {

    name: string;
    kernel: string;
    ramdisk: string;
    memory: number;
    vcpus: number;
    colors: Colors[];
    passthrough_dtb: string;

}
