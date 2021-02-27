// import {Injectable} from '@angular/core';
// import {BehaviorSubject} from 'rxjs';
// import { Boq } from './boq';

// /**
//  * Node for to-do item
//  */
// // export class TodoItemNode {
// //   children: TodoItemNode[];
// //   item: string;
// // }

// export class Metric{
//   qty: number;
//   order_rate: number;
//   labour: number;
//   amount: number;
//   constructor(qty, order_rate, labour, amount) { 
//     this.qty = qty;
//     this.order_rate = order_rate;
//     this.labour = labour;
//     this.amount = amount;
//   }
// }

// export class TodoItemNode{
//   item: string;
//   boq: Metric;
//   children: TodoItemNode[];
// }

// /** Flat to-do item node with expandable and level information */
// // export class TodoItemFlatNode {
// //   item: string;
// //   level: number;
// //   expandable: boolean;
// // }

// export class TodoItemFlatNode{
//   item: string;
//   boq: Metric;
//   level: number;
//   expandable: boolean;
// }

// let groceries = new TodoItemNode();
// groceries.item = "Main boq";

// let almond = new TodoItemNode();
// almond.item = 'boq 1.1';
// almond.boq = new Metric(10, 50, 10, 510);

// let boq_2 = new TodoItemNode();
// boq_2.item = 'boq 1.2';
// boq_2.boq = new Metric(100, 43, 10, 100 * 43 + 10);
// groceries.children = [almond, boq_2];

// /**
//  * Checklist database, it can build a tree structured Json object.
//  * Each node in Json object represents a to-do item or a category.
//  * If a node is a category, it has children items and new items can be added under the category.
//  */
// @Injectable()
// export class ChecklistDatabase {
//   dataChange = new BehaviorSubject<TodoItemNode[]>([]);

//   get data(): TodoItemNode[] { return this.dataChange.value; }

//   constructor() {
//     this.initialize();
//   }

//   initialize() {
//     // Notify the change.
//     this.dataChange.next(null);
//   }

//   /**
//    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
//    * The return value is the list of `TodoItemNode`.
//    */

//   /** Add an item to to-do list */
//   insertItem(parent: TodoItemNode, name: string) {
//     if (!parent.children) {
//       parent.children = []
//     }
//       parent.children.push({ item: name } as TodoItemNode);
//       this.dataChange.next(this.data);
//   }

//   updateItem(node: TodoItemNode, name: string) {
//     node.item = name;
//     this.dataChange.next(this.data);
//   }
// }