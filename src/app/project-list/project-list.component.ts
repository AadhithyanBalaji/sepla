import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectListItem } from '../models/project-list-item';
import { ProjectService } from '../services/project.service';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  dataSource = new MatTableDataSource<ProjectListItem>([]);



  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [];
  projectToEdit: ProjectListItem;
  isLoading = true;
  expandedElement: ProjectListItem | null;
  expandedElements: ProjectListItem[] = [];

  constructor(private projectService: ProjectService,
  public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort;
    this.projectService.projectList$
      .subscribe(data => {
        this.dataSource.data = data;
        if (data.length > 0) {
          // this.displayedColumns = Object.getOwnPropertyNames(this.dataSource.data[0]).filter(x => x !== "id");
          // this.displayedColumns.push("actions");
          this.displayedColumns = ['name', 'target_date', 'location', 'order_value', 'target_prime_cost', 'actual_prime_cost', 'target_PL', 'actual_PL', 'actions'];
        }
        this.isLoading = false;
      });
  }

  editProject(event) {
    console.log('receieved ', event);
    this.projectService.editProject(event);
  }

  deleteProject(event) {
    console.log('receieved ', event);
    this.projectService.deleteProject(event);
  }

  expandRow(event) {
    this.expandedElement = this.expandedElement === event ? null : event;
  }

  openProject(project: ProjectListItem) {
    const dialogRef = this.dialog.open(ProjectDetailComponent, {
      width: '100vw',
      height: '90vh',
      data: project,
      disableClose : true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
