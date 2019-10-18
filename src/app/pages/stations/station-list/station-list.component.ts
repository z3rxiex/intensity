import { _Station } from './../station';
import { ToastrService } from 'ngx-toastr';
import { StationsService } from './../../../services/stations.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {
  // Public
  stations: any;



  // dtTrigger: Subject = new Subject();

  constructor(private stationsService: StationsService, private toastr: ToastrService) { }

  ngOnInit() {
    this.stationsService.getStations()
      .subscribe(response => {
        this.stations = response;
      }
    );

    $(document).ready(function() {
     

      // tslint:disable-next-line: only-arrow-functions
      $('.btn-delete').click(function() {
        const table = $('#stationList').DataTable();
        table.row($(this).parents('tr')).remove().draw();
      });
    });
  }

  deleteStation(stationIndex: number) {

    const delTitle = 'Station: ' + this.stations[stationIndex].code;
    const station = new _Station();
    station.id = this.stations[stationIndex].id;

    this.stationsService.deleteStation(station)
      .subscribe(Response => {
        this.toastr.success('Has been successfully deleted', delTitle);
        this.stations.splice(stationIndex, 1);
      },
      err => {
        console.log(err);
        this.toastr.error('Error has occured. Please contact web admin.', delTitle);
      }
    );
  }


}
