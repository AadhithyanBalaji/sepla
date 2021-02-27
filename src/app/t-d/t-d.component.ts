import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectListItem } from '../models/project-list-item';

@Component({
  selector: 'app-t-d',
  templateUrl: './t-d.component.html',
  styleUrls: ['./t-d.component.css']
})
export class TDComponent implements OnInit {
  @Input('column')column;
  @Input('element')element : ProjectListItem;

  @Output() deleteProject: EventEmitter<ProjectListItem> = new EventEmitter<ProjectListItem>();
  @Output() editProject: EventEmitter<ProjectListItem> = new EventEmitter<ProjectListItem>();

  isAction = false;

  constructor() { }

  ngOnInit(): void {
    this.isAction = this.column === "actions";
  }

  edit() {
    this.editProject.emit(this.element);
  }

  delete() {
    this.deleteProject.emit(this.element);
  }


}
