import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscription } from 'rxjs';
import { Brand } from '../models/brand';
import { ICollectionService } from './ICollectionService';

@Injectable({
  providedIn: 'root'
})
export class BrandService implements ICollectionService, OnDestroy{
  data: Brand[];

  storeSubscription : Subscription = null;

  collection$: Observable<Brand[]>;
  brandListSubject = new Subject<Brand[]>();

  editBrand$: Observable<Brand>;
  editBrandSubject = new Subject<Brand>();

  constructor(private store: AngularFirestore) {
    this.collection$ = this.brandListSubject.asObservable();
    this.editBrand$ = this.editBrandSubject.asObservable();

    this.store.collection('brands').valueChanges({ idField: 'id' })
      .subscribe(data => {
        this.data = data as Brand[];
        this.brandListSubject.next(this.data);
    });
    //this.setupBrandStream();

    // let b = new Brand(uuid.v4(), 'AKG', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
    // this.store.collection('brands').add(Object.assign({}, b));
    // b = new Brand(uuid.v4(), 'BEC', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
    // this.store.collection('brands').add(Object.assign({}, b));
    // b = new Brand(uuid.v4(), 'Havells', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
    // this.store.collection('brands').add(Object.assign({}, b));
    // b = new Brand(uuid.v4(), 'Legrand Myrius', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
    // this.store.collection('brands').add(Object.assign({}, b));
    // b = new Brand(uuid.v4(), 'Anchor', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
    // this.store.collection('brands').add(Object.assign({}, b));
    // b = new Brand(uuid.v4(), 'Jainson', 'Aadhi', this.getToday(), 'Aadhi', this.getToday());
  }
  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
  
  requestCollection() {
      this.setupBrandStream();
  }

  setupBrandStream() {
    if (this.storeSubscription === null) {
      this.storeSubscription = this.store.collection("brands").get().subscribe((querySnapshot) => {
        this.data = [];
        querySnapshot.forEach((doc) => {
          let proj = doc.data() as Brand;
          this.data.push(proj);
        });
        this.brandListSubject.next(this.data);
      });
    }
    else {
      this.brandListSubject.next(this.data);
    }
  }

  getToday() {
    return new Date().toLocaleDateString();
  }

  addBrand(brand: Brand) {
    //check if it is an update
    var index = this.data.findIndex(x => x.id === brand.id);
    if (index !== -1) {
      this.store.collection('brands').doc(brand.id).update(brand);
    }
    else {
      this.store.collection("brands").doc(brand.id).set(Object.assign({}, brand))
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
    //this.brandListSubject.next(this.data);
  }

  editBrand(brand: Brand) {
    this.editBrandSubject.next(brand);
  }

  deleteBrand(brand: Brand) {
    this.store.collection('brands').doc(brand.id).delete();
    //this.brandListSubject.next(this.data);
  }
}
