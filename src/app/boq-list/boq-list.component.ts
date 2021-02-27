import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Boq } from '../models/boq';
import { ProjectListItem } from '../models/project-list-item';
import { BoqService } from '../services/boq.service';

@Component({
  selector: 'app-boq-list',
  templateUrl: './boq-list.component.html',
  styleUrls: ['./boq-list.component.css']
})
export class BoqListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
