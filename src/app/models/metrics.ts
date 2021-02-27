export class Metrics {
    name: string;
    value: number;
    icon: string;
    constructor(name, value, icon) {
        this.name = name;
        this.value = value;
        this.icon = icon;
    }
}