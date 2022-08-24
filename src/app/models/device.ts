export class Device {

    name: string
    address: number

    constructor(
        name: string = "",
        address: number = 0    
    ) {
        this.name = name;
        this.address = address;
    }

}
