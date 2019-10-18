import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavHeaderComponent } from './layout/nav-header/nav-header.component';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { ParticlesComponent } from './layout/particles/particles.component';
import { MainComponent } from './main/main.component';
import { NavSidebarComponent } from './nav-sidebar/nav-sidebar.component';
import { StationsService } from './services/stations.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { MapHealthComponent } from './pages/stations/map-health/map-health.component';
import { StationListComponent } from './pages/stations/station-list/station-list.component';
import { EditStationComponent } from './pages/stations/edit-station/edit-station.component';
import { AddStationComponent } from './pages/stations/add-station/add-station.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    BreadcrumbComponent,
    ParticlesComponent,
    MainComponent,
    NavSidebarComponent,
    MapHealthComponent,
    StationListComponent,
    EditStationComponent,
    AddStationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastrModule.forRoot() 
  ],
  providers: [StationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
