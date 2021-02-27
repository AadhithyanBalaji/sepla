import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { AddProjectComponent } from 'src/app/project-list/add-project/add-project.component';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.css']
})
export class ActionTableComponent implements OnInit, AfterViewInit {


  // @Input('collection') collection: string;
  @Input('data') data: any[];
  @Input('displayedColumns') displayedColumns = [];
  @Input('displayActions') displayActions = false;
  @Input('isLoading') isLoading = true;

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  length = 100;
  pageSize = 8;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<any>([]);
  // displayedColumns = [];
 // dataSubs: Subscription;
  // isLoading = true;
  service;

  constructor(private tableService: TableService) { }

  ngOnInit(): void {
    if (!this.isLoading) {
      this.isLoading = false;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.data = this.data;
    }

    
  }

  ngAfterViewInit() {
    // let service = this.tableService.getCollectionObservable(this.collection);
    // if (service != null) {
    //   this.dataSubs = service.collection$
    //     .subscribe(data => {
    //       this.isLoading = false;
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //       this.dataSource.data = data;
    //       if (this.dataSource.data.length > 0) {
    //         this.displayedColumns = Object.getOwnPropertyNames(this.dataSource.data[0]).filter(x => x !== "id");
    //         if (this.displayActions) {
    //           this.displayedColumns.push('actions');
    //         }
    //       }
    //     });

    //   service.requestCollection();
    // }
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAction(event) {
    return event === "actions";
  }

  editElement(element) {
    this.edit.emit(element);
  }

  deleteElement(element) {
    this.delete.emit(element);
  }

}
