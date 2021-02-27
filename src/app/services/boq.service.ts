import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Boq } from '../boq-list/add-boq/add-boq.component';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class BoqService {

  projectId = null;

  data: Boq[];

  boq$: Observable<Boq[]>;
  boqSubject = new Subject<Boq[]>();

  constructor(private store: AngularFirestore,
    private projectService: ProjectService) {
    this.boq$ = this.boqSubject.asObservable();
  }

  initialize(projectId) {
    this.projectId = projectId;
    let ref = this.store.collection('boqs').doc(this.projectId).
      valueChanges().pipe(take(1)).subscribe((data) => {
        this.data = [];
        if (data) {
          let d = [];
          let n = Object.keys(data).length;
          for (let i = 0; i < n; i++) {
            d.push(data[i]);
          }
          this.data = d;
        }
        this.boqSubject.next(this.data);
      });
  }

  saveBoq(data: Boq[]) {
    console.log('saving', data);
    this.store.collection('boqs').doc(this.projectId).set(Object.assign({}, data) ,{merge: true})
      .then(() => {
        let obj = { order_value: 0, prime_value: 0 };
        data.forEach(element => {
          this.getOrderAndPrimeValue(element, obj);
        });

        this.projectService.setOrderValue(this.projectId, obj.order_value);
        // this.project.target_prime_cost = obj.prime_value;
        //  this.project.target_PL = this.project.order_value - this.project.target_prime_cost;
        //  this.store.collection('projects').doc(this.projectId).update(this.project);
        console.log("written successfully");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

  getOrderAndPrimeValue(startNode: Boq, val: { order_value: number, prime_value: number }): number[] {
    if (startNode.boq_order_amount)
      val.order_value += startNode.boq_order_amount;
    if (startNode.priceList && Object.keys(startNode.priceList).length > 0) {
      for (let i = 0; i < Object.keys(startNode.priceList).length; i++) {
        val.prime_value += startNode.priceList[i].amount;
      }
    }
    startNode.children.forEach(element => {
      this.getOrderAndPrimeValue(element, val);
    });
    if (!startNode || !startNode.children)
      return;
  }

}
