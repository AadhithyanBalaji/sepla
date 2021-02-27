import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  form: FormGroup;
  startDate = new Date();
  project = new Brand();

  constructor(private formBuilder: FormBuilder,
    private formService: BrandService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      targetDate: [null],
      location: [null, [Validators.required]],
      orderValue: [null, [Validators.required]],
    });

    this.formService.editBrand$.subscribe(data => {
      if( data !== null) {
        this.project = data;
        this.form.patchValue({
          name : data.name
        });
      }
    });
  }


  submit() {
    if (!this.form.valid) {
      return;
    }
    let brand = new Brand();
    if(this.project !== null) {
      brand = this.project;
    }
    brand.id = brand.id ?? uuid.v4();
    brand.name = this.form.value.name;
    
    this.formService.addBrand(brand);
  }
}
