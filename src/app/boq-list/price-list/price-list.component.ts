import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { isEmpty, map, startWith } from 'rxjs/operators';
import { Material } from 'src/app/models/material';
import { ProjectListItem } from 'src/app/models/project-list-item';
import { BoqService } from 'src/app/services/boq.service';
import { ProjectService } from 'src/app/services/project.service';
import { Boq, Price } from '../add-boq/add-boq.component';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit, OnDestroy, OnChanges {

  @Input('projectId') projectId = '';
  @Input('node') node: Boq;
  @Output('save') save = new EventEmitter<Boq>();

  collection;
  previousPriceList: Price[] = [];

  //form members
  form: FormGroup;

  //autocomplete
  options: Material[] = []; // = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Material[]>;

  //table members
  data: Price[] = [];
  dataSource = new MatTableDataSource<Price>([]);
  displayedColumns = ['material', 'qty', 'price', 'amount', 'actions'];

  constructor(private formBuilder: FormBuilder,
    private store: AngularFirestore,
  private projectService: ProjectService) { }

  ngOnDestroy(): void {
    this.dataSource.data = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']) {
      if (this.node.priceList && this.node.priceList.length > 0) {
        this.dataSource.data = this.node.priceList;
      }
      else {
        this.dataSource.data = [];
      }
    }
  }

  ngOnInit(): void {
    this.collection = "materials_" + this.projectId;
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      rate: new FormControl({ value: null, disabled: 'true' })
    });

    this.dataSource.data = [];

    if (this.node.priceList != null || this.node.priceList != undefined) {
      let data = this.node.priceList;
      this.previousPriceList = this.node.priceList;
      this.dataSource.data = data;
    }

    //autocomplete logic
    let ref = this.store.collection(this.collection).valueChanges({ idField: 'mid' });

    ref.subscribe((data: Material[]) => {
      if (data) {
        this.options = data;
      }
    });

    this.filteredOptions = this.form.get('name').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: any): Material[] {
    if (value === null || undefined)
      return;
    if (typeof (value) !== "string") {
      value = value.name;
    }
    const filterValue = value.toLowerCase();
    let options = this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    if (options.length === 0) {
      this.form.patchValue({
        rate: null
      });
    }
    return options;
  }

  optionSelected(event) {
    var selectedMaterial: Material = event.option.value;
    this.form.patchValue({
      rate: selectedMaterial.prime_rate
    });
  }

  optionActivated(event) {
    this.optionSelected(event);
  }

  displayFn(user: Material): string {
    return user != null || undefined ? user.name : '';
  }

  onQtyUpdate(element: Price) {
    var index = this.node.priceList.findIndex(x => x.material == element.material);
    if (index !== -1) {
      this.node.priceList[index].qty = element.qty;
      this.node.priceList[index].amount = this.node.priceList[index].price * element.qty;
    }
  }

  submit() {
    if (!this.form.valid || !this.form.get('rate').value) {
      return;
    }
    let p = this.form.getRawValue();
    let price = new Price();
    price.material = p.name.name;
    price.qty = p.qty;
    price.price = p.rate;
    price.amount = p.rate * p.qty;

    this.form.reset();

    this.projectService.updateTargetPrimeCost(this.projectId, price.amount);
    //insert into datasource

    this.node.priceList.push(Object.assign({}, price));
    this.dataSource.data = this.node.priceList;
  }

  delete(price: Price) {
    let data = this.dataSource.data;
    let index = data.findIndex(x => x.material == price.material);
    if (index != -1) {
      this.node.priceList.splice(index, 1);
      this.dataSource.data = this.node.priceList;
      this.projectService.updateTargetPrimeCost(this.projectId, -price.amount);
    }
  }
}
