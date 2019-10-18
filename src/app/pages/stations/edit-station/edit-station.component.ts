import { _Station } from './../station';
import { StationsService } from './../../../services/stations.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.css']
})
export class EditStationComponent implements OnInit {
  station: any;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private route: ActivatedRoute, private StationsService: StationsService, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.StationsService.getStationDetials(params.get('stationID'))
          .subscribe(response => {
            this.station = response;
            console.log(this.station);
          });
      });

    // tslint:disable-next-line: only-arrow-functions
    $(document).ready(function() {
      $('#inputDate').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
      });

      // tslint:disable-next-line: only-arrow-functions
      $('#inputDate').change(function() {
        $('#inputDate').trigger('click');
      });
    });
  }

  dateSelected(newDate: any) {
    this.station[0].date_installed = newDate;
  }

  UpdateStation() {
    const station = new _Station();
    const msgTitle = 'Station Code: ' + this.station[0].code;

    station.id = this.station[0].id;
    station.name = this.station[0].name;
    station.mac = this.station[0].mac;
    station.location = this.station[0].location;
    station.latitude = this.station[0].latitude;
    station.longitude = this.station[0].longitude;
    station.elevation = this.station[0].elevation;
    station.date_installed = this.station[0].date_installed;


    console.log(station);
    this.StationsService.updateStation(station)
    .subscribe(response => {
      this.toastr.success('Station has been successfully updated.', msgTitle);
    },
    err => {
      console.log(err);
      this.toastr.error('Error has occured. Please contact web admin.', msgTitle);
    });
  }

}
