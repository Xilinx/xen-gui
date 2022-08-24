export class Memory {

    startAddress: number
    endAddress: number
    size: number
    
    constructor(
        startAddress: number = 0,
        endAddress: number = 0,
        size: number = 0
    ){
        this.startAddress = startAddress;
        this.endAddress = endAddress;
        this.size = size;
    }
}
