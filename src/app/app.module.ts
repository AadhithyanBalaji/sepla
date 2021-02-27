import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AddProjectComponent } from './project-list/add-project/add-project.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SpacerPipe } from './pipes/spacer.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { CdkColumnDef, CdkTableModule } from '@angular/cdk/table';
import { TDComponent } from './t-d/t-d.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialsComponent } from './materials/materials.component';
import { LabourComponent } from './labour/labour.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { AddBrandComponent } from './brand-list/add-brand/add-brand.component';
import { ActionTableComponent } from './framework/action-table/action-table.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AddMaterialComponent } from './materials/add-material/add-material.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BoqListComponent } from './boq-list/boq-list.component';
import { MatTreeModule } from '@angular/material/tree';
import { AddBoqComponent } from './boq-list/add-boq/add-boq.component';
import { PriceListComponent } from './boq-list/price-list/price-list.component';
import { ExcelImportComponent } from './framework/excel-import/excel-import.component';
import { ProjectDetailComponent } from './project-list/project-detail/project-detail.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    MetricCardComponent,
    ProjectListComponent,
    AddProjectComponent,
    SpacerPipe,
    TDComponent,
    MaterialsComponent,
    LabourComponent,
    BrandListComponent,
    AddBrandComponent,
    ActionTableComponent,
    NotFoundComponent,
    AddMaterialComponent,
    BoqListComponent,
    AddBoqComponent,
    PriceListComponent,
    ExcelImportComponent,
    ProjectDetailComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    CdkTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatTreeModule,
    MatSelectModule
  ],
  providers: [CdkColumnDef],
  bootstrap: [AppComponent]
})
export class AppModule { }