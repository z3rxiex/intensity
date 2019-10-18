import { Component, OnInit } from '@angular/core';
import { StationsService } from 'src/app/services/stations.service';
import { btnStatus, stationMarkerStatus } from 'src/app/templates/default';

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
  // Private
  private stationsHrData: any;
  private map: any;
  private markers: any = [];
  private SelectedDate = new Date();
  private currYear: number = this.SelectedDate.getFullYear();
  private currMonth: number = (this.SelectedDate.getMonth() + 1);
  private currDay: number = this.SelectedDate.getDate();


  FormatedDate: any = this.currYear.toString() + '-' + this.currMonth.toString() +
    '-' + this.currDay.toString();
  private intervalId: any;

  // Public
  stationsData: any;
  stationsPrevData: any;
  colsCount = 24;

  NewSelectedDate = this.FormatedDate;

  constructor(private stationService: StationsService) { }

  ngOnInit() {

    this.map = L.map('map').setView([51.505, -0.09], 13);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    this.stationService.getStationsData(this.FormatedDate)
      .subscribe(response => {
          this.stationsData = response;
          this.stationsPrevData = response;  // initialize previous data

          const colUpdate = 'UpdateCount' + this.SelectedDate.getHours().toString();

          // Load Station Marker
          this.stationsData.forEach(station => {

            const htmlContent = '<span class="font-weight-bold">' + station.name + '</span><br><br>' +
              'Status : Active' + '<br>' +
              'Last Update: ' + (station.LatestLog === '' ? 'No Data' : this.FormatedDate + ' ' + station.LatestLog) + '<br><br>' +
              'Location : ' + station.location + '<br>' +
              'Latitude : ' + station.latitude + '<br>' +
              'Longitude : ' + station.longitude + '<br>' +
              'Elevation: ' + station.elevation + '<br>';


            // const stationMarker = L.marker([station.latitude, station.longitude]).bindPopup(htmlContent + chartContent).addTo(this.map);
            // const stationMarker = L.marker([station.latitude, station.longitude]).bindPopup(htmlContent).addTo(this.map);
            const stationMarker = L.marker([station.latitude, station.longitude],
              {icon: L.AwesomeMarkers.icon({icon: 'home', prefix: 'fa', markerColor: this.getStationMarkerStatus(station[colUpdate]) })})
              .bindPopup(htmlContent).addTo(this.map);
            this.markers.push(stationMarker);
          });

          const group = new L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds());
        }
      );

    this.startAutoRefreshData();  // Start auto refresh

      // Datepicker jquery
    // tslint:disable-next-line: only-arrow-functions
    $(document).ready(function() {
      $('#inputDate').datepicker({
        changeMonth: true,
        changeYear: true,
        maxDate: '+0M',
        dateFormat: 'yy-mm-dd',
      });

      // tslint:disable-next-line: only-arrow-functions
      $('#inputDate').change(function() {
        $('#inputDate').trigger('click');
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
    // return this.selectedDate.getFullYear();
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
      // if (typeof(this.stationsHrData[index][colHr]) === 'undefined') {   // Update current hour only
        this.stationsData[index][colHr] = this.stationsHrData[index][colHr];
        this.stationsData[index][colhrLog]  = this.stationsHrData[index][colhrLog];
      // }
    }

    return this.stationsData[index][colHr];
   // return curr_hr;
  }

  getBtnStatus(index: number, hr: number) {

    if (typeof(this.stationsData) === 'undefined') {
      return false;
    }

    const colUpdate = 'UpdateCount' + hr.toString();
    const colUpdateCount = parseInt(this.stationsData[index][colUpdate], 0);
    let btnStat: string;


    switch (true) {
      case colUpdateCount === 0:
          btnStat = btnStatus.btnRed;
          break;
      case (colUpdateCount > 0 && colUpdateCount < 200) :
            btnStat = btnStatus.btnWarning;
            break;
      case (colUpdateCount >= 200 && colUpdateCount < 360) :
              btnStat = btnStatus.btnSuccess;
              break;
      default:
          btnStat = btnStatus.btnOk;
          break;
    }

    return btnStat;
   // return curr_hr;

  }

  getStationMarkerStatus(updateCount: number) {

    let stationStat;

    // console.log(updateCount);

    switch (true) {
      case updateCount == 0:
        stationStat = stationMarkerStatus.stationRed;
        break;
      case (updateCount > 0 && updateCount < 200) :
        stationStat = stationMarkerStatus.stationOrange;
        break;
      case (updateCount >= 200 && updateCount < 360) :
        stationStat  = stationMarkerStatus.stationGreen;
        break;
      default:
        stationStat = stationMarkerStatus.stationOk;
        break;
    }

    return stationStat;
  }

  getUpdateCount(index: number, hr: number) {

    if (typeof(this.stationsData) === 'undefined') {
      return false;
    }

    const colUpdate = 'UpdateCount' + hr.toString();
    const colHr = 'HR' + hr.toString() + '_status';
    // console.log(this.stationsData);

    return  (this.stationsData[index][colHr] === 2 ? '' : this.stationsData[index][colUpdate]) ;
  }

  showData() {
    const newDate = this.NewSelectedDate.split('-');
    const currDate = new Date();
    let CurrentState = false;

    this.SelectedDate = new Date(newDate[0].toString() + '-' + newDate[1].toString() + '-' + newDate[2].toString());
    // console.log(this.SelectedDate);

    this.currYear = this.SelectedDate.getFullYear();
    this.currMonth = (this.SelectedDate.getMonth() + 1);
    this.currDay = this.SelectedDate.getDate();

    // Stop auto refresh
    clearInterval(this.intervalId);

    // Check if current date, run auto refresh again
    if (currDate.getFullYear() === this.SelectedDate.getFullYear()
      && currDate.getMonth() === this.SelectedDate.getMonth()
      &&  currDate.getDay() === this.SelectedDate.getDay()) {
      this.startAutoRefreshData();

      CurrentState = true;
    }


    this.FormatedDate = this.currYear.toString() + '-' + this.currMonth.toString() +
      '-' + this.currDay.toString();

    this.stationService.getStationsData(this.FormatedDate)
    .subscribe(response => {
        this.stationsData = response;

        if (CurrentState) {
          this.stationsPrevData = response;  // initialize previous data
        }

        // Update stations marker content
        this.stationsData.forEach((station, index) => {
          const htmlContent = '<span class="font-weight-bold">' + station.name + '</span><br><br>' +
            'Status : Active' + '<br>' +
            'Last Update: ' + this.FormatedDate + ' ' + station.LatestLog + '<br><br>' +
            'Location : ' + station.location + '<br>' +
            'Latitude : ' + station.latitude + '<br>' +
            'Longitude : ' + station.longitude + '<br>' +
            'Elevation: ' + station.elevation + '<br>';
          this.markers[index].setPopupContent(htmlContent);
        });
      }
    );

  }

  updateFormateDate(newDate: any) {
    this.NewSelectedDate = newDate;
    // console.log(this.NewSelectedDate);
  }

  startAutoRefreshData() {
    // Get Data every 60 secs
    this.intervalId = setInterval (() => {
      this.stationService.getStationsHrData()
        .subscribe(response => {
            this.stationsHrData = response;
            // console.log(this.stationsHrData);
            // console.log(this.stationsData);

            // Update stations marker content
            this.stationsHrData.forEach((station, index) => {
              const htmlContent = '<span class="font-weight-bold">' + station.name + '</span><br><br>' +
                'Status : Active' + '<br>' +
                'Last Update: ' + (station.LatestLog === '' ? 'No Data' : this.FormatedDate + ' ' + station.LatestLog) + '<br><br>' +
                'Location : ' + station.location + '<br>' +
                'Latitude : ' + station.latitude + '<br>' +
                'Longitude : ' + station.longitude + '<br>' +
                'Elevation: ' + station.elevation + '<br>';
              this.markers[index].setPopupContent(htmlContent);
            });
        }
      );

    }, 15000);
  }

  onTest() {
    // this.markers[0].setPopupContent('Test');
  }


}
