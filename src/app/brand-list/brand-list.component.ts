import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { BrandService } from '../services/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

  collection = 'brands';

  constructor(public dialogRef: MatDialogRef<BrandListComponent>) { }

  ngOnInit(): void {

  }

  editBrand(event) {
    console.log(event);
  }

  deleteBrand(event) {
    console.log(event);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
