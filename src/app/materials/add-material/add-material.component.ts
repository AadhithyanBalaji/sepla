import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Material } from 'src/app/models/material';
import { BrandService } from 'src/app/services/brand.service';
import { MaterialService } from 'src/app/services/material.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

  @Input('projectId') projectId: string;
  @Output() addMaterial: EventEmitter<Material> = new EventEmitter<Material>();

  form: FormGroup;
  
  options: string[] = []; // = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  mid = null;
  
  constructor(private formBuilder: FormBuilder,
    private brandService: BrandService,
  private materialService: MaterialService) { }

  ngOnInit(): void {
    
    this.materialService.editMaterial$.subscribe((data : Material) => {
      this.form.patchValue({
        name: data.name,
        brand: data.brand,
        mrp: data.prime_rate,
        price_escalation: data.price_escalation,
        acc: data.accessory_rate,
        discount: data.discount,
        //purchaseRate: new FormControl({ value: '', disabled: 'true' }, [Validators.required])
      });
      this.mid = data.mid;
    })

    this.form = this.formBuilder.group({
      name: new FormControl('',[Validators.required]),
      brand: new FormControl('', [Validators.required]),
      mrp: new FormControl('', [Validators.required]),
      price_escalation: new FormControl('',[Validators.required, Validators.min(0), Validators.max(100)]),
      acc: new FormControl('', [Validators.required,  Validators.min(0), Validators.max(100)]),
      discount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      purchaseRate: new FormControl({ value: '', disabled: 'true' }, [Validators.required])
    });

    this.form.get('mrp').valueChanges.subscribe(data => {
      this.calculatePurchaseRate();
    });

    this.form.get('price_escalation').valueChanges.subscribe(data => { 
      this.calculatePurchaseRate();
    })

    this.form.get('discount').valueChanges.subscribe(data => {
      this.calculatePurchaseRate();
    });

    this.form.get('acc').valueChanges.subscribe(data => {
      this.calculatePurchaseRate();
    });

    this.filteredOptions = this.form.get('brand').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.brandService.collection$.subscribe(data => {
      if (data) {
        let opts = [];
        data.forEach(element => {
          opts.push(element.name);
        });
        this.options = opts;
      }
     });

    this.brandService.requestCollection();
  }

  private calculatePurchaseRate() {
    let mrp = this.form.get('mrp'),
      price_escalation = this.form.get('price_escalation'),
      discount = this.form.get('discount'),
      acc = this.form.get('acc');
    const escalatedPrice = (1 + (price_escalation.value / 100)) * mrp.value;
    const purchaseRate = (1 - (discount.value / 100)) * escalatedPrice;
    const accessory = (1 + acc.value / 100) * purchaseRate;
        
    this.form.patchValue({ purchaseRate: accessory });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    let d = this.form.getRawValue();
    //new material scenario
    let m = new Material();
    m.name = d.name;
    m.brand = d.brand;
    m.prime_rate = d.mrp;
    m.price_escalation = d.price_escalation;
    m.accessory_rate = d.acc;
    m.discount = d.discount;
    m.price = d.purchaseRate;
    
    m.mid = this.mid;
    
   // this.materialService.addMaterial(m);
    this.addMaterial.emit(m);
  }

}
