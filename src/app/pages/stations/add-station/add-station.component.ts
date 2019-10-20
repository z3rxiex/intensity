import { _Station } from './../station';
import { Component, OnInit, Renderer} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StationsService } from './../../../services/stations.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.css']
})
export class AddStationComponent implements OnInit {

  errMsg = '';
  station = new _Station();
  form = new FormGroup({
    // tslint:disable-next-line: object-literal-key-quotes
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    mac: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    latitude: new FormControl('', Validators.required),
    longitude: new FormControl('', Validators.required),
    elevation: new FormControl('', Validators.required),
    dateinstalled: new FormControl('', Validators.required),
  });


  constructor(private router: Router, private stationsService: StationsService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }


  AddStation() {
    const msgTitle = 'Station Code: ' + this.station.code;

    if (!this.validateStation()) {
      return false;
    }

    this.station.code = this.form.get('code').value;
    this.station.name = this.form.get('name').value;
    this.station.mac = this.form.get('mac').value;
    this.station.location = this.form.get('location').value;
    this.station.latitude = this.form.get('latitude').value;
    this.station.longitude = this.form.get('longitude').value;
    this.station.elevation = this.form.get('elevation').value;
    this.station.date_installed = this.form.get('dateinstalled').value;

    this.stationsService.addStation(this.station)
    .subscribe(response => {
      this.toastr.success('Station has been successfully added.', msgTitle);
      this.redirectToStation();
    },
    err => {
      console.log(err);
      this.toastr.error('Error has occured. Please contact web admin.', msgTitle);
    });
  }

  validateStation() {
    this.errMsg = '';

    if (this.form.get('code').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Station Code is required.<br>';
    }

    if (this.form.get('name').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Station Name is required.<br>';
    }

    if (this.form.get('mac').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>MAC Address is required.<br>';
    }

    if (this.form.get('location').invalid) {
      this.errMsg += '<i class="fa fa-times-circle text-danger mr-2"></i>Location is required.<br>';
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

  redirectToStation() {
    this.router.navigate(['stations']);

  }



}
