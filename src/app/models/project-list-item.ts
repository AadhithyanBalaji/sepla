export class ProjectListItem {
    id: string;
    name: string;
    target_date: string;
    location: string;
    order_value: number;
    target_prime_cost: number;
    actual_prime_cost: number;
    target_PL: number;
    actual_PL: number;

    constructor() {
        this.name = '';
        this.target_date = new Date().toLocaleDateString();
        this.location = '';
        this.order_value = 0;
        this.target_prime_cost = 0;
        this.actual_prime_cost = 0;
        this.target_PL = 0;
        this.actual_PL = 0;
    }
  }