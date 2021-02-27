import { Material } from "./material";

export class MaterialList{
    material: Material;
    qty: number;
    price: number;
}

export class Boq{
    mid: string;
    name: string;

    isParent: boolean;

    qty: number;
    order_rate: number;
    materialList: MaterialList[];
    labour: number;
    amount: number;

    constructor(name, qty, order_rate) {
        this.name = name;
        this.qty = qty;
        this.order_rate = order_rate;
    }

}

export class BoqListItem{
    boq: Boq;
    children: BoqListItem[];
}

