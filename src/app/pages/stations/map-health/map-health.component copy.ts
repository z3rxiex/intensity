import { Component, OnInit } from '@angular/core';
import { StationsService } from 'src/app/services/stations.service';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

declare let L;




const DefaultIcon = L.icon({
  iconUrl: './assets/img/leaflet/marker-icon.png'
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'map-health',
  templateUrl: './map-health.component.html',
  styleUrls: ['./map-health.component.css']
})
export class MapHealthComponent implements OnInit {
  stations: any;
  stationsData: any;
  stationsHrData: any;
  map: any;
  markers: any = [];
  colsCount = 24;
  SelectedDate = new Date();
  currYear: number = this.SelectedDate.getFullYear();
  currMonth: number = (this.SelectedDate.getMonth() + 1);
  currDay: number = this.SelectedDate.getDate();


  FormatedDate: any = this.currYear.toString() + '-' + this.currMonth.toString() +
    '-' + this.currDay.toString();

  constructor(private stationService: StationsService) { }

  ngOnInit() {

    this.map = L.map('map').setView([51.505, -0.09], 13);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.stationService.getStationsData(this.FormatedDate)
    .subscribe(response => {
        this.stationsData = response;
      }
    );

    this.stationService.getStations()
      .subscribe(response => {
          this.stations = response;
          // Load Marker

          this.stations.forEach(station => {

            const htmlContent = '<span class="font-weight-bold">' + station.name + '</span><br><br>' +
              'Status : Active' + '<br>' +
              'Last Update: ????' + '<br><br>' +
              'Location : ' + station.location + '<br>' +
              'Latitude : ' + station.latitude + '<br>' +
              'Longitude : ' + station.longitude + '<br>' +
              'Elevation: ' + station.elevation + '<br>';


            // const stationMarker = L.marker([station.latitude, station.longitude]).bindPopup(htmlContent + chartContent).addTo(this.map);
            const stationMarker = L.marker([station.latitude, station.longitude]).bindPopup(htmlContent).addTo(this.map);

            this.markers.push(stationMarker);
          });

          const group = new L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds());
        }
      );

    // Get Data every 60 secs
    setInterval (() => {
        this.stationService.getStationsHrData()
          .subscribe(response => {
              this.stationsHrData = response;
          }
        );
        console.log(new Date().getHours());
      }, 15000);

      // Datepicker jquery
    $(document).ready(function() {
      $('#FormatedDate').datepicker({
        changeMonth: true,
        changeYear: true,
        maxDate: '+0M',
        dateFormat: 'yy-mm-dd',
      });

      $('#FormatedDate').change(function() {
        $('#FormatedDate').trigger('click');
      });
    });
  }

  returnColumn(n: number): any[] {
    return Array(n);
  }

  convertStrCol(col: number) {
    let colStr: string;
    colStr = (col < 10 ? '0' + col.toString() : col.toString());
    return colStr;
  }

  getName() {
    //return this.selectedDate.getFullYear();
  }

  getStatus(index: number, hr: number) {
    /*return 0 - with data
             1 - no Data
             2 - not within hour
    */
    if (typeof(this.stationsData) === 'undefined') {
      return false;
    }

    const colHr = 'HR' + hr.toString() + '_status';
    const colhrLog = 'LatestLog' + hr.toString();
    const currDate = new Date();

    const currHr: number = currDate.getHours();


    if (hr > currHr && (currDate.getFullYear() === this.SelectedDate.getFullYear())
      && currDate.getMonth() === this.SelectedDate.getMonth()
      &&  currDate.getDay() === this.SelectedDate.getDay()) {
      this.stationsData[index][colHr] = 2; // so display as outline
    }

    if (typeof(this.stationsHrData) !== 'undefined' && hr === currHr && (currDate.getFullYear() === this.SelectedDate.getFullYear())
      && currDate.getMonth() === this.SelectedDate.getMonth()
      &&  currDate.getDay() === this.SelectedDate.getDay()) {   // Update current hour only
      // if (typeof(this.stationsHrData) !== 'undefined') {   // Update current hour only
        this.stationsData[index][colHr] = this.stationsHrData[index][colHr];
        this.stationsData[index][colhrLog]  = this.stationsHrData[index][colhrLog];
    }

    return this.stationsData[index][colHr];
   // return curr_hr;
  }

  getBtnStatus(index: number, hr: number) {

    if (typeof(this.stationsData) === 'undefined') {
      return false;
    }

    const colHr = 'HR' + hr.toString() + '_status';
    let btnStat: string;


    switch (this.stationsData[index][colHr]) {
      case '1':
          btnStat = 'btn-danger';
          break;
      default:
          btnStat = 'btn-primary';
          break;
    }

    return btnStat;
   // return curr_hr;

  }

  showData() {
    /*
    //this.test1 = 55;
    //this.stationsData[0]['HR7_status'] = 0; // so display as outline
    //console.log(this.SelectedDate);
    //console.log(new Date(this.currYear.toString() + '-' + this.currMonth.toString() + '-' + (this.currDay - 1).toString()));
    this.SelectedDate = new Date('2018-01-20');
    console.log(this.SelectedDate);

    this.currYear = this.SelectedDate.getFullYear();
    this.currMonth = (this.SelectedDate.getMonth() + 1);
    this.currDay = this.SelectedDate.getDate();

    this.FormatedDate = this.currYear.toString() + '-' + this.currMonth.toString() +
      '-' + this.currDay.toString();

    this.stationService.getStationsData(this.FormatedDate)
    .subscribe(response => {
        this.stationsData = response;
      }
    );
    */
    alert(this.FormatedDate);
  }

  updateFormateDate(newDate: any) {
    this.FormatedDate = newDate;
  }


}
