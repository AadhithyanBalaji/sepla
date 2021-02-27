import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AddBrandComponent } from '../brand-list/add-brand/add-brand.component';
import { BrandListComponent } from '../brand-list/brand-list.component';
import { Brand } from '../models/brand';
import { NotFoundComponent } from '../not-found/not-found.component';
import { BrandService } from './brand.service';
import { MaterialService } from './material.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private brandService: BrandService,
    private materialService: MaterialService,
  private dialog: MatDialog) { }

  getCollectionObservable(collection) {
    switch (collection) {
      case 'brands': return this.brandService;
      case 'materials': return this.materialService;
    }
    return null;
  }

  navigateToAddElementDialog(collection) {
    let component;
    switch (collection) {
      case 'brands': component = AddBrandComponent;
        break;
      default:
        component = NotFoundComponent;
      // case 'materials': component = ;
    }
    const dialogRef = this.dialog.open(component, {
      width: '80vw',
      height: '80vh',
     // scrollStrategy
    });
  }
}
