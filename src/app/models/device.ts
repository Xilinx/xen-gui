export class Device {

    name: string
    address: number
    type: string
    selected: boolean

    type_peripheral_list : string[] =   ["ethernet", "spi", "usb", "serial", "cci", "can", "i2c", "gpu", "pcie", "rtc", "gpio", "ams"];
    type_internal_list : string[] =     ["dma", "timer", "watchdog", "mmc", "rtc", "zynqmp_phy", "zynqmp-display", "nand", "ahci"];

    constructor(
        name: string = "",
        address: number = 0,
        type: string = "",
        selected: boolean = false
    ) {
        this.name = name;
        this.address = address;
        this.type = type;
        this.selected = selected;
        if(type == ""){
            for(var i = 0; i < this.type_internal_list.length; ++i){
                if(this.name.indexOf(this.type_internal_list[i]) >= 0){
                    type = "internal";
                    break;
                }
            }
            for(var i = 0; i < this.type_peripheral_list.length; ++i){
                if(this.name.indexOf(this.type_peripheral_list[i]) >= 0){
                    type = "peripheral";
                    break;
                }
            }
        }
    }

}
