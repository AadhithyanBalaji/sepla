import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectListItem } from 'src/app/models/project-list-item';
import { ProjectService } from 'src/app/services/project.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {

  projectForm: FormGroup;
  startDate = new Date();
  project = new ProjectListItem();
  isExpanded = false;

  constructor(private formBuilder: FormBuilder,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      targetDate: [null],
      location: [null, [Validators.required]],
      orderValue: [null, [Validators.required]],
    });

    this.projectService.editProject$.subscribe(data => {
      if( data !== null) {
        this.isExpanded = true;
        this.project = data;
        this.projectForm.patchValue({
          name : data.name,
          targetDate : new Date(data.target_date),
          location: data.location
        });
      }
    });
  }


  submit() {
    if (!this.projectForm.valid) {
      return;
    }
    let project = new ProjectListItem();
    if(this.project !== null) {
      project = this.project;
    }
    project.id = project.id ?? uuid.v4();
    project.name = this.projectForm.value.name;
    project.target_date = this.projectForm.value.targetDate != null ? new Date(this.projectForm.value.targetDate).toLocaleDateString() : null;
    project.location = this.projectForm.value.location;
    
    this.panelClose();
    
    this.projectService.addProject(project);
  }

  panelClose(){
    this.isExpanded = false;
    this.clearForm();
  }

  private clearForm() {
    this.projectForm.patchValue({
      name : null,
      targetDate : null,
      location: null
    });
    this.projectForm.clearValidators();
  }
}
