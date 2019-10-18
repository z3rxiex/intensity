import { Component, OnInit } from '@angular/core';
import { StationsService } from 'src/app/services/stations.service';
import { btnStatus, stationMarkerStatus, intPercentage } from 'src/app/templates/default';

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
  private CurrentState = false;


  // Public
  stationsData: any;
  colsCount = 24;

  NewSelectedDate = this.FormatedDate;

  constructor(private stationService: StationsService) { }

  ngOnInit() {

    /* Initilize Map */

    // Base Maps
    const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains : ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; <a href="https://www.google.com/copyright">GoogleMap</a> contributors'
    });

    const googleTer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; <a href="https://www.google.com/copyright">GoogleMap</a> contributors'
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const baselayers = {
      'Google Satellite': googleSat,
      'Google Terrain': googleTer,
      'Open StreetMap': osm
    };

    this.map = L.map('map', {
      layers: [osm]
    }).setView([-41.2858, 174.78682], 14);

    L.control.layers(baselayers).addTo(this.map);

    this.stationService.getStationsData(this.FormatedDate)
      .subscribe(response => {
          this.stationsData = response;
          this.CurrentState = true;

          const colUpdate = 'UpdateCount' + this.SelectedDate.getHours().toString();

          // Load Station Marker
          this.stationsData.forEach(station => {

            const htmlContent = '<span class="font-weight-bold">Code: ' + station.code + '</span><br>' +
              '<span class="font-weight-bold">Name: ' + station.name + '</span><br><br>' +
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

    if (currDate.getFullYear() === this.SelectedDate.getFullYear()
      && currDate.getMonth() === this.SelectedDate.getMonth() &&  currDate.getDay() === this.SelectedDate.getDay()) {

      if (hr > currHr) {
        this.stationsData[index][colHr] = 2; // so display as outline
      }

      if (typeof(this.stationsHrData) !== 'undefined' && hr === currHr) {
        this.stationsData[index][colHr] = this.stationsHrData[index][colHr];
        this.stationsData[index][colhrLog]  = this.stationsHrData[index][colhrLog];
      }

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
      case colUpdateCount === intPercentage.intRed:
          btnStat = btnStatus.btnRed;
          break;
      case (colUpdateCount > intPercentage.intRed && colUpdateCount < this.returnIntPrct(intPercentage.intGreen, hr)) :
            btnStat = btnStatus.btnWarning;
            break;
      case (colUpdateCount >= this.returnIntPrct(intPercentage.intGreen, hr) &&
        colUpdateCount < this.returnIntPrct(intPercentage.intOk, hr)) :
              btnStat = btnStatus.btnSuccess;
              break;
      default:
          btnStat = btnStatus.btnOk;
          break;
    }

    return btnStat;
   // return curr_hr;

  }

  returnIntPrct(intensitylevel: number, hr: number) {
    const currHr: number =  new Date().getHours();
    let currMinutes: number  = (this.CurrentState === true && hr === currHr ? new Date().getMinutes() : 60);
    currMinutes = currMinutes * intensitylevel;   // times the value by 6 since every 10 secs there is 6 records

    return currMinutes;
  }

  getStationMarkerStatus(updateCount: number) {

    let stationStat;
    const currHr: number = new Date().getHours();


    // console.log(updateCount);

    switch (true) {
      // tslint:disable-next-line: triple-equals
      case updateCount == intPercentage.intRed:
        stationStat = stationMarkerStatus.stationRed;
        break;
      case (updateCount > intPercentage.intRed && updateCount < this.returnIntPrct(intPercentage.intGreen, currHr)) :
        stationStat = stationMarkerStatus.stationOrange;
        break;
      case (updateCount >= this.returnIntPrct(intPercentage.intGreen, currHr) &&
        updateCount < this.returnIntPrct(intPercentage.intOk, currHr)) :

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

      this.CurrentState = true;
    }

    this.FormatedDate = this.currYear.toString() + '-' + this.currMonth.toString() +
      '-' + this.currDay.toString();

    this.stationService.getStationsData(this.FormatedDate)
    .subscribe(response => {
        this.stationsData = response;

        // Update stations marker content
        this.stationsData.forEach((station, index) => {
          const htmlContent = '<span class="font-weight-bold">Code: ' + station.code + '</span><br>' +
            '<span class="font-weight-bold">Name: ' + station.name + '</span><br><br>' +
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
      const colUpdate = 'UpdateCount' + new Date().getHours().toString();

      this.stationService.getStationsHrData()
        .subscribe(response => {
            this.stationsHrData = response;
            // console.log(this.stationsHrData);
            // console.log(this.stationsData);

            // Update stations marker content
            this.stationsHrData.forEach((station, index) => {
              const htmlContent = '<span class="font-weight-bold">Code: ' + station.code + '</span><br>' +
                '<span class="font-weight-bold">Name: ' + station.name + '</span><br><br>' +
                'Status : Active' + '<br>' +
                'Last Update: ' + (station.LatestLog === '' ? this.stationsData[index].LatestLog :
                  this.FormatedDate + ' ' + station.LatestLog) + '<br><br>' +
                'Location : ' + station.location + '<br>' +
                'Latitude : ' + station.latitude + '<br>' +
                'Longitude : ' + station.longitude + '<br>' +
                'Elevation: ' + station.elevation + '<br>';
              this.markers[index].setPopupContent(htmlContent);
              this.stationsData[index][colUpdate] = station[colUpdate];  // update the update count

              const updateMarker = L.AwesomeMarkers.icon({
                icon: 'home',
                prefix: 'fa',
                markerColor: this.getStationMarkerStatus(station[colUpdate]),
              });

              this.markers[index].setIcon(updateMarker);

            });

            console.log('refresh');
        }
      );

    }, 5000);
  }

  onTest() {
    // this.markers[0].setPopupContent('Test');
  }

  getReturnCount(index: number, hr: number) {

    // const colUpdate = 'UpdateCount' + hr.toString();
    // const colUpdateCount = parseInt(this.stationsData[index][colUpdate], 0);  // times default 6

    // return colUpdateCount;
    return '';

  }


}
