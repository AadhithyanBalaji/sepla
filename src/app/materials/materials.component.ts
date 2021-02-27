import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Material } from '../models/material';
import { ProjectListItem } from '../models/project-list-item';
import { MaterialService } from '../services/material.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  @Input('element') element: ProjectListItem;

  collection : string;
  projectId : string;
  data: Material[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = [];
  isLoading = true;
  

  constructor(private materialService: MaterialService,
    private store: AngularFirestore) {
  }

  ngOnInit(): void {
    this.projectId = this.element.id;
    this.collection = "materials_" + this.projectId;

    let ref = this.store.collection(this.collection).valueChanges({ idField: 'mid' });

    ref.subscribe((data) => {
      if (data) {
        this.dataSource.data = data;
        if (data.length > 0) {
          this.displayedColumns = ['name', 'brand', 'prime_rate', 'price_escalation', 'discount', 'accessory_rate', 'price', 'actions']
        }
      }
      this.isLoading = false;
    });
  }

  addMaterial(material) {
    if (material.mid != null) {
      this.store.collection(this.collection).doc(material.mid).update(Object.assign({}, material));
    }
    else {
      this.store.collection(this.collection).add(Object.assign({}, material));
    }
  }

  edit(material) {
    this.materialService.editMaterialSubject.next(material);
  }

  delete(material) {
    this.store.collection(this.collection).doc(material.mid).delete();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAction(event) {
    return event === "actions";
  }

}
