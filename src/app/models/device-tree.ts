import { Device } from "./device"
import { Memory } from "./memory"

export class DeviceTree {

    numberOfCPUs: number
    numberOfMemories: number
    memories: Memory[]
    numberOfAvailableDevices: number
    availableDevices: Device[]
    disabledDevices: Device[]

    constructor(
        numberOfCPUs: number = 0,
        numberOfMemories: number = 0,
        memories: Memory[] = [],
        numberOfAvailableDevices: number = 0,
        availableDevices: Device[] = [],
        disabledDevices: Device[] = []
    
    ){
        this.numberOfCPUs = numberOfCPUs;
        this.numberOfMemories = numberOfMemories;
        this.memories = memories;
        this.numberOfAvailableDevices = numberOfAvailableDevices;
        this.availableDevices = availableDevices;
        this.disabledDevices = disabledDevices;
    }

}
