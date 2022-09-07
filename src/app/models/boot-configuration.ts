export class BootConfiguration {

    memory_high_value: number;
    memory_low_value: number;
    load_command: string;
    boot_command: string;
    xen_binary: string;
    xen_command: string;

    constructor(
        memory_high_value: number = 0,
        memory_low_value: number = 0,
        load_command: string = "mmc",
        boot_command: string = "booti",
        xen_binary: string = "xen",
        xen_command: string = "console=dtuart dtuart=serial0 bootscrub=0 vwfi=native sched=null"
    ){
        this.memory_high_value = memory_high_value;
        this.memory_low_value = memory_low_value;
        this.load_command = load_command;
        this.boot_command = boot_command;
        this.xen_binary = xen_binary;
        this.xen_command = xen_command;
    }

}
