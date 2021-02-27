import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  editMaterial$: Observable<Material>;
  editMaterialSubject = new Subject<Material>();

  constructor() {
    this.editMaterial$ = this.editMaterialSubject.asObservable();
  }
}
