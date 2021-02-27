import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProjectListItem } from '../models/project-list-item';
import * as uuid from 'uuid';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  //dataSource: ProjectListDataSource;
  data: ProjectListItem[];
  ref = null;

  projectList$: Observable<ProjectListItem[]>;
  projectListSubject = new Subject<ProjectListItem[]>();

  editProject$: Observable<ProjectListItem>;
  editProjectSubject = new Subject<ProjectListItem>();

  constructor(private store: AngularFirestore) {
    this.projectList$ = this.projectListSubject.asObservable();
    this.editProject$ = this.editProjectSubject.asObservable();

    this.ref = this.store.collection('projects');
    this.ref.valueChanges({ idField: 'id' })
      .subscribe(data => {
        this.data = data as ProjectListItem[];
        this.projectListSubject.next(this.data);
      });
  }

  addProject(project: ProjectListItem) {
    //check if it is an update
    var index = this.data.findIndex(x => x.id === project.id);
    if (index !== -1) {
      this.ref.doc(project.id).update(project);
    }
    else {
      this.ref.doc(project.id).set(Object.assign({}, project))
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
  }

  editProject(project: ProjectListItem) {
    this.editProjectSubject.next(project);
  }

  deleteProject(project: ProjectListItem) {
    this.ref.doc(project.id).delete();
    //this.projectListSubject.next(this.data);
  }

  setOrderValue(projectId, order_value) {
    const index = this.data.findIndex(x => x.id === projectId);
    if (index !== -1) {
      let project = this.data[index];
      project.order_value = order_value;
      project.target_PL = project.order_value - project.target_prime_cost;
      this.ref.doc(projectId).update(project);
    }
  }

  updateTargetPrimeCost(projectId, prime_cost) {
    const index = this.data.findIndex(x => x.id === projectId);
    if (index !== -1) {
      let project = this.data[index];
      project.target_prime_cost += prime_cost;
      project.target_PL = project.order_value - project.target_prime_cost;
      this.ref.doc(projectId).update(project);
    }
  }
}


 // this.store.collection("projects").get().subscribe((querySnapshot) => {
    //   this.data = [];
    //   querySnapshot.forEach((doc) => {
    //     let proj = new ProjectListItem();
    //     proj = doc.data() as ProjectListItem;
    //     this.data.push(proj);
    //   });
    //   this.projectListSubject.next(this.data);
    // });

    // this.store.collection('projects').add({ id: uuid.v4(), name: 'KVB TRY DO', target_date: new Date('2021-03-10').toLocaleDateString(), location: 'Trichy', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 10 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'Kinfra', target_date: new Date('2021-06-12').toLocaleDateString(), location: 'Trivandrum', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 15 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'Renaatus TNSB', target_date: new Date('2021-07-30').toLocaleDateString(), location: 'Manali new town', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 40 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'CDB', target_date: new Date('2021-06-30').toLocaleDateString(), location: 'Poojappura', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 65 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'Trineva TNSB', target_date: new Date('2021-10-01').toLocaleDateString(), location: 'Manali new town', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 25 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'OMC', target_date: new Date('2021-12-30').toLocaleDateString(), location: 'Ooty', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 85 });
    // this.store.collection('projects').add({ id: uuid.v4(), name: 'KVB TRY DO', target_date: new Date('2021-03-10').toLocaleDateString(), location: 'Trichy', order_value: 100, target_prime_cost: 90, actual_prime_cost: 90, target_PL: 30, actual_PL: 10 });

    // this.projectListSubject.next(this.data);