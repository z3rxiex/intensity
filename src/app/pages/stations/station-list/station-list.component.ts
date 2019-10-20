import { _Station } from './../station';
import { ToastrService } from 'ngx-toastr';
import { StationsService } from './../../../services/stations.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;


  // Public
  stations: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();



  // dtTrigger: Subject = new Subject();

  constructor(private stationsService: StationsService, private toastr: ToastrService) { }

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10
    };
    this.stationsService.getStations()
      .subscribe(response => {
        this.stations = response;
        this.dtTrigger.next();
      }
    );

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  deleteStation(stationIndex: number) {

    const delTitle = 'Station: ' + this.stations[stationIndex].code;
    const station = new _Station();
    station.id = this.stations[stationIndex].id;

    this.stationsService.deleteStation(station)
      .subscribe(Response => {
        this.toastr.success('Has been successfully deleted', delTitle);
        this.stations.splice(stationIndex, 1);

        // Call the dtTrigger to rerender again
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      },
      err => {
        console.log(err);
        this.toastr.error('Error has occured. Please contact web admin.', delTitle);
      }
    );

  }


}
