export class Device {

    name: string
    address: number
    type: string
    selected: string
    label: string
    path: string

    constructor(
        name: string = "",
        address: number = 0,
        path: string = "",
        type: string = "",
        selected: string = "",
        label: string = "",
    ) {
        this.name = name;
        this.address = address;
        this.type = type;
        this.selected = selected;
        this.path = path;

       this.type = type;
        if(label == ""){
            this.label = this.name;
        }
        else {
            this.label = label;
        }
    }

}
