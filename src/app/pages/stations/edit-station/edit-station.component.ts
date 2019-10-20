import { _Station } from './../station';
import { StationsService } from './../../../services/stations.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormGroup } from '@angular/forms';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.css']
})
export class EditStationComponent implements OnInit {
  errMsg = '';
  station: any;
  form = new FormGroup({
    // tslint:disable-next-line: object-literal-key-quotes
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    mac: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    gewog: new FormControl('', Validators.required),
    latitude: new FormControl('', Validators.required),
    longitude: new FormControl('', Validators.required),
    elevation: new FormControl('', Validators.required),
    dateinstalled: new FormControl('', Validators.required),
  });

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private route: ActivatedRoute, private StationsService: StationsService, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.StationsService.getStationDetials(params.get('stationID'))
          .subscribe(response => {
            this.station = response;
            this.form.controls.code.setValue(this.station[0].code);
            this.form.controls.name.setValue(this.station[0].name);
            this.form.controls.mac.setValue(this.station[0].mac);
            this.form.controls.location.setValue(this.station[0].location);
            this.form.controls.gewog.setValue(this.station[0].gewog);
            this.form.controls.latitude.setValue(this.station[0].latitude);
            this.form.controls.longitude.setValue(this.station[0].longitude);
            this.form.controls.elevation.setValue(this.station[0].elevation);
            this.form.controls.dateinstalled.setValue(this.station[0].date_installed);
          });
      });
  }


  UpdateStation() {

    if (!this.validateStation()) {
      return false;
    }

    const station = new _Station();
    const msgTitle = 'Station Code: ' + this.station[0].code;

    station.id = this.station[0].id;
    station.code = this.form.get('code').value;
    station.name = this.form.get('name').value;
    station.mac = this.form.get('mac').value;
    station.location = this.form.get('location').value;
    station.gewog = this.form.get('gewog').value;
    station.latitude = this.form.get('latitude').value;
    station.longitude = this.form.get('longitude').value;
    station.elevation = this.form.get('elevation').value;
    station.date_installed = this.form.get('dateinstalled').value;

    this.StationsService.updateStation(station)
    .subscribe(response => {
      this.toastr.success('Station has been successfully updated.', msgTitle);
    },
    err => {
      console.log(err);
      this.toastr.error('Error has occured. Please contact web admin.', msgTitle);
    });
  }

  validateStation() {
    this.errMsg = '';

    if (this.form.get('name').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Station Name is required.<br>';
    }

    if (this.form.get('mac').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>MAC Address is required.<br>';
    }

    if (this.form.get('location').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Location is required.<br>';
    }

    if (this.form.get('gewog').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Gewog is required.<br>';
    }

    if (this.form.get('latitude').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Latitude is required.<br>';
    }

    if (this.form.get('longitude').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Longitude is required.<br>';
    }

    if (this.form.get('elevation').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Elevation is required.<br>';
    }

    if (this.form.get('dateinstalled').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Date Installed is required.<br>';
    }

    return (this.errMsg !== '' ? false : true);

  }

}
