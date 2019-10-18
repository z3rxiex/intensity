import { _Station } from './../station';
import { Component, OnInit, Renderer} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StationsService } from './../../../services/stations.service';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.css']
})
export class AddStationComponent implements OnInit {

  station = new _Station();
  // currentDate = new Date();


  constructor(private renderer: Renderer, private route: ActivatedRoute, private router: Router, private stationsService: StationsService, 
              private toastr: ToastrService) { }

  ngOnInit() {
    //   this.station.date_installed = new Date(this.currentDate.toString() + '-' + this.currentDate.toString() +
    //   '-' + this.currentDate.toString());

  }
/*
  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click', (event) => {
      this.router.navigate(['/stations']);
    });
  }
*/
  dateSelected(newDate: any) {
    this.station.date_installed = newDate;
  }

  AddStation() {
    console.log(this.station);
    const msgTitle = 'Station Code: ' + this.station.code;
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

  redirectToStation() {
    setTimeout(() => {
      window.location.replace('/stations');
    }, 2000);
  }

  log(x) {
    console.log(x);
  }

}
