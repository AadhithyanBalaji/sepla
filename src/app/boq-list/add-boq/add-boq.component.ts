import { NestedTreeControl } from '@angular/cdk/tree';
import { Input, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BoqService } from 'src/app/services/boq.service';

export class BoqMaster {
  boqList: Boq[];
}

export class Price {
  material: string;
  qty: number;
  price: number;
  amount: number;
}

export class Boq {
  id: string;
  projectId: string;
  desc: string;
  qty: number;
  boq_order_rate: number;
  boq_order_amount: number;
  order_value: number;
  priceList: Price[]

  isSelected: boolean = false;
  children?: Boq[];

  constructor() {
    this.desc = '';
    // this.qty = 0;
    // this.boq_order_rate = 0;
    // this.boq_order_amount = 0;
    this.priceList = [];
    this.children = [];
    this.isSelected = false;
  }
}

export class ExcelColumn {
  desc: string;
  colname: string;
  isSelected: boolean;

  constructor(desc, colname, selected) {
    this.desc = desc;
    this.colname = colname;
    this.isSelected = selected;
  }
}

@Component({
  selector: 'app-add-boq',
  templateUrl: './add-boq.component.html',
  styleUrls: ['./add-boq.component.css']
})
export class AddBoqComponent implements OnInit, OnDestroy {

  @Input('projectId') projectId;

  //excel variables
  readonly boqno_text = "BOQ No.";
  readonly desc_text = "Description";
  readonly qty_text = "Qty";
  readonly rate_text = "Rate";
  readonly amount_text = "Amount";
  readonly excelColOptions = [this.boqno_text, this.desc_text, this.qty_text, this.rate_text, this.amount_text];

  //to hold complete excel import data
  imported_data: any;
  //table variables
  excelDataSource = new MatTableDataSource<any>([]);
  displayedColumns = [];

  excel_columns = [];
  col_map = new Map(); //holds mapping of imported excel's columns to excelColOptions
  select_options = new Map(); //holds options for select on top of each column
  error_text = '';  //to display missing mappings

  //tree variables
  treeControl = new NestedTreeControl<Boq>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Boq>();
  selectedNode: Boq = null;

  //createParent = true;
  form: FormGroup;

  //expand-panel
  isExpanded = false;

  constructor(private boqService: BoqService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let placeHolderNode = new Boq();
    placeHolderNode.projectId = this.projectId;

    this.boqService.boq$.subscribe((data) => {
      if (!data) {
        this.dataSource.data = [Object.assign({}, placeHolderNode)];
      }
      else {
        this.dataSource.data = data;
      }
    });

    this.boqService.initialize(this.projectId);
  }

  ngOnDestroy(): void {
    this.resetSelect();
    if (this.dataSource.data.length > 0 && this.dataSource.data[0].desc !== '') {
      this.boqService.saveBoq(this.dataSource.data);
    }
  }

  hasChild = (_: number, node: Boq) => !!node.children && node.children.length > 0;

  refreshDataSource() {
    let data = this.dataSource.data;
    this.dataSource.data = null;
    this.dataSource.data = data;
  }

  addNewParent() {
    let d = new Boq();
    d.projectId = this.projectId;

    let data = this.dataSource.data;
    data.push(Object.assign({}, d));
    this.dataSource.data = data;
  }

  addNewNodeItem(node: Boq) {
    let d = new Boq();
    d.projectId = this.projectId;

    this.dataSource.data.forEach(element => {
      this.addChild(element, node, d);
    });

    this.refreshDataSource();
  }

  select(node: Boq) {
    if (this.selectedNode) {
      if (this.selectedNode == node) {
        node.isSelected = false;
        this.selectedNode = null;
      }
      this.selectedNode.isSelected = false;
    }
    node.isSelected = !node.isSelected;
    this.selectedNode = node;
  }

  resetSelect() {
    if (this.selectedNode) {
      this.selectedNode.isSelected = false;
      this.selectedNode = null;
    }
  }

  deleteNodeItem(node: Boq) {
    this.selectedNode = null;
    this.dataSource.data.forEach(element => {
      this.deleteNode(element, node);
    });
    this.refreshDataSource();
  }

  addChild(startNode: Boq, node: Boq, childNode: Boq) {
    if (startNode.desc == node.desc) {
      if (startNode.children && startNode.children.length == 0) {
        startNode.qty = 0;
        startNode.order_value = 0;
        startNode.boq_order_amount = 0;
        startNode.boq_order_rate = 0;
        startNode.priceList = [];
        startNode.isSelected = false;
      }
      startNode.children.push(Object.assign({}, childNode));
      return;
    }
    else {
      if (startNode.children) {
        startNode.children.forEach(element => {
          this.addChild(element, node, childNode);
        });
      }
    }
  }

  updateNode(startNode: Boq, node: Boq, newNode: Boq) {
    if (startNode.desc == node.desc) {
      startNode.desc = newNode.desc;
      startNode.children = newNode.children;
      startNode.projectId = newNode.projectId;
      startNode.priceList = newNode.priceList;
      return;
    }
    else {
      if (startNode.children) {
        startNode.children.forEach(element => {
          this.updateNode(element, node, newNode);
        });
      }
    }
  }

  //needs to be updated to handle base array deletions
  deleteNode(startNode: Boq, node: Boq) {
    if (startNode.desc == node.desc) {
      var index = this.dataSource.data.findIndex(x => x.desc == startNode.desc);
      this.dataSource.data.splice(index, 1);
    }
    if (startNode.children) {
      let index = startNode.children.findIndex(x => x.desc === node.desc);
      if (index != - 1) {
        startNode.children.splice(index, 1);
        return;
      }
      else {
        startNode.children.forEach(element => {
          this.deleteNode(element, node);
        });
      }
    }
  }

  //excel import functions

  getDefaultSelectedValue(column) {
    let opt_selected = this.col_map.get(column) ?? null;
    if (opt_selected !== null)
      this.mappingChanged({ value: opt_selected }, column);
    return opt_selected;
  }

  /*
  take top 10 records from excel and get the keys/column names for table display
  then try to match the mapping with col based on column text
  */
  excelImported(data: any[]) {
    console.log('imported ', data);
    this.imported_data = [...data];
    this.excelDataSource.data = data = [...data.splice(0, 10)];
    if (data.length > 0) {
      let max_length_keys = [];
      let max_row = data[0];
      data.forEach(element => {
        let row_keys = Object.keys(element);
        if (max_length_keys.length < row_keys.length) {
          max_length_keys = row_keys;
          max_row = element;
        }
      });

      this.excel_columns = max_length_keys;

      this.excel_columns.forEach(element => {
        this.select_options.set(element, [...this.excelColOptions]);
      });
      this.displayedColumns = Object.getOwnPropertyNames(max_row);
      //guess the mappings
      let temp_options = [...this.excelColOptions];
      for (let i = 0; i < data.length && temp_options.length > 0; i++) {
        let row = data[i];
        for (let j = 0; j < this.excel_columns.length; j++) {
          let column = this.excel_columns[j];
          let cell_data: string = row[column];
          let matched_element = null;
          for (var ind = 0; ind < temp_options.length; ind++) {
            if (cell_data && !Number(cell_data)) {
              matched_element = this.matchCellData(column, cell_data, temp_options[ind]);
              if (matched_element !== null)
                break;
            }
          }
          var index = temp_options.findIndex(x => x === matched_element);
          if (index !== -1) {
            temp_options.splice(index, 1);
          }
        }
      }
    }
    console.log('guessed', this.col_map, 'excel_columns', this.excel_columns, 'display_columns', this.displayedColumns, 'column_select_options' , this.select_options);
  }

  matchCellData(column, cell_data, option_text: string) {
    if (cell_data.toLocaleLowerCase().trim().indexOf(option_text.toLocaleLowerCase()) >= 0) {
      this.col_map.set(column, option_text);
      return option_text;
    }
    return null;
  }

  mappingChanged(mapping, column) {
    const option_selected = mapping.value;
    const saved_mapping = this.col_map.get(column);

    for (let select_option of this.select_options) {
      const col_name = select_option[0];
      let col_select_options: string[] = select_option[1];
      if (col_name !== column) {
        var index = col_select_options.findIndex(x => x === option_selected);
        if (index !== -1) {
          col_select_options.splice(index, 1);
        }
        if (saved_mapping !== undefined && saved_mapping !== option_selected) {
          col_select_options.push(saved_mapping);
          col_select_options.sort();
        }
      }
    }
    this.col_map.set(column, option_selected);
 //   console.log('selected', option_selected, 'col_map', this.col_map, 'selection_options', this.select_options);
  }

  checkMapping() {
    let remaining_mapping = [...this.excelColOptions];
    this.excel_columns.forEach(column => {
      if (this.col_map.has(column)) {
        var option = this.col_map.get(column);
        var index = remaining_mapping.findIndex(x => x === option);
        if (index != -1) {
          remaining_mapping.splice(index, 1);
        }
      }
    });
    if (remaining_mapping.length > 0)
      this.error_text = remaining_mapping.join(', ') + ' not yet mapped to a column';
    else {
      this.error_text = '';
      this.convertToBoq(this.imported_data);
    }
    console.log('check mapping done');
  }

  convertToBoq(data) {
    console.log('converting to boq');
    let startRow = 0;
    const row_count = Object.keys(data).length;
    for (let i = 0; i < row_count; i++) {
      let row = data[i];
      let keys = Object.keys(row);
      if (keys.length > 0) {
        for (let j = 0; j < keys.length; j++) {
          if (row[keys[j]] === "S.No") {
            startRow = i++;
            break;
          }
        }
      }
      if (startRow !== 0) {
        break;
      }
    }

    let boqList: Boq[] = [];
    let parent: Boq = null;

    for (let i = startRow; i < row_count; i++) {
      let row = data[i];
      let keys = Object.keys(row);
      let temp_boq = new Boq();
      keys.forEach(element => {
        // temp.push(row[element]);
        switch (this.col_map.get(element)) {
          case this.boqno_text:
            temp_boq.id = row[element];
            break;
          case this.desc_text:
            temp_boq.desc = row[element];
            break;
          case this.qty_text:
            temp_boq.qty = row[element];
            break;
          case this.rate_text:
            temp_boq.boq_order_rate = row[element];
            break;
          case this.amount_text:
            temp_boq.boq_order_amount = row[element];
            break;
        }
      });

      //parent
      if (temp_boq.id && temp_boq.desc && (!temp_boq.qty || Object.is(Number(temp_boq.qty), temp_boq.qty))) {
        temp_boq.projectId = this.projectId;
        if (!temp_boq.qty) {
          parent = Object.assign({}, temp_boq);
          boqList.push(Object.assign({}, parent));
        }
        else {
          parent.children.push(Object.assign({}, temp_boq));
        }
      }
    }

    if (boqList.length > 0) {
      //close expander
      this._snackBar.open('Imported ' + boqList.length + ' BOQ', null, {
        duration: 2000,
      });
      this.dataSource.data = boqList;
    }
    else {
      this._snackBar.open('No BOQs imported', null, {
        duration: 2000,
      });
    }
    this.resetExcelPreviewTable();
    this.panelClose();
  }

  resetExcelPreviewTable() {
    this.imported_data = [];
    this.excelDataSource.data = [];
    this.displayedColumns = [];
    this.excel_columns = [];
    this.col_map = new Map();
    this.select_options = new Map();
    this.error_text = '';
  }

  panelClose() {
    this.isExpanded = false;
  }
}