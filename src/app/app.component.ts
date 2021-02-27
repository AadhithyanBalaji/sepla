import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { BrandListComponent } from './brand-list/brand-list.component';
import { Metrics } from './models/metrics';
import * as XLSX from 'xlsx';
import { Boq } from './boq-list/add-boq/add-boq.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SEPLA';

  
  // spinnerEnabled = false;
  // keys: string[];
  // dataSheet = new Subject();
  // @ViewChild('inputFile') inputFile: ElementRef;
  // isExcelFile: boolean;

  orderval = new Metrics('Order value', 0, 'power');
  tpc = new Metrics('Target prime cost', 0, 'power');
  apc = new Metrics('Actual prime cost', 0, 'power');
  tpl = new Metrics('Target P/L', 0, 'power');
  apl = new Metrics('Actual P/L', 0, 'power');

  constructor(public dialog: MatDialog) {
    
  }

  openBrandDialog() {
    this.dialog.open(BrandListComponent, {
      width: '80vw',
      height: '80vh',
     // scrollStrategy
    });
  }



  // onChange(evt) {
  //   let data, header;
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
  //   if (target.files.length > 1) {
  //     this.inputFile.nativeElement.value = '';
  //   }
  //   if (this.isExcelFile) {
  //     this.spinnerEnabled = true;
  //     const reader: FileReader = new FileReader();
  //     reader.onload = (e: any) => {
  //       /* read workbook */
  //       const bstr: string = e.target.result;
  //       const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //       /* grab first sheet */
  //       const wsname: string = wb.SheetNames[0];
  //       const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //       /* save data */
  //       data = XLSX.utils.sheet_to_json(ws);

  //       let startRow = 0;

  //       for (let i = 0; i < data.length; i++) {
  //         let row = data[i];
  //         let keys = Object.keys(row);
  //         if (keys.length > 0) {
  //           for (let j = 0; j < keys.length; j++) {
  //             if (row[keys[j]] === "S.No") {
  //               startRow = i;
  //               break;
  //             }
  //           }
  //         }
  //         if (startRow !== 0) {
  //           break;
  //         }
  //       }
        
  //       let boqList: Boq[] = [];
  //       let parent: Boq = null;

  //       debugger;
  //       for (let i = startRow; i < data.length; i++) {
  //         let row = data[i];
  //         let keys = Object.keys(row);
  //         let temp = [];
  //         keys.forEach(element => {
  //           temp.push(row[element]);
  //         });
  //         //parent
  //         if (temp.length == 2 && String(temp[0]).toLocaleLowerCase() !== "s.no.") {
  //           if (parent !== null) {
  //             boqList.push(parent);
  //           }
  //           parent = new Boq();
  //           parent.id = temp[0];
  //           parent.desc = temp[1];
  //         }
  //         if (temp.length >= 4 && String(temp[0]).toLocaleLowerCase() !== "s.no.") {
  //           let sno = temp[0];
  //           // //means parent
  //           // if (Number.isInteger(Number(sno))) {
  //           //   if (parent !== null) {
  //           //     boqList.push(parent);
  //           //   }
  //           //   parent = new Boq();
  //           // }
  //           // else {
  //             let boq = new Boq();
  //             boq.id = sno;
  //             boq.desc = temp[1];
  //             boq.qty = temp[3];
  //             boq.boq_order_rate = temp[4];
  //             boq.boq_order_amount = temp[5];
  //             parent.children.push(boq);
  //           // }
  //         }
  //       }


  //     };

  //     reader.readAsBinaryString(target.files[0]);

  //     reader.onloadend = (e) => {
  //       this.spinnerEnabled = false;
  //       this.keys = Object.keys(data[0]);
  //       this.dataSheet.next(data)
  //     }
  //   } else {
  //     this.inputFile.nativeElement.value = '';
  //   }
  // }

  // removeData() {
  //   this.inputFile.nativeElement.value = '';
  //   this.dataSheet.next(null);
  //   this.keys = null;
  // }

}
