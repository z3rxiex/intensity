import { EditStationComponent } from './pages/stations/edit-station/edit-station.component';
import { AddStationComponent } from './pages/stations/add-station/add-station.component';
import { StationListComponent } from './pages/stations/station-list/station-list.component';
import { MapHealthComponent } from './pages/stations/map-health/map-health.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'map-health',
    component: MapHealthComponent
  },
  {
      path: 'station/edit/:stationID',
      component: EditStationComponent
  },
  {
    path: 'station/add',
    component: AddStationComponent
  },
  {
    path: 'stations',
    component: StationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
