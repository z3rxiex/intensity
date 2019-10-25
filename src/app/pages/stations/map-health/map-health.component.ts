import { Component, OnInit } from '@angular/core';
import { StationsService } from 'src/app/services/stations.service';
import { btnStatus, stationMarkerStatus, intPercentage } from 'src/app/templates/default';
import * as moment from 'moment-timezone';


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

  constructor(private stationService: StationsService) { }
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
  CurrHr: number = parseInt(moment().tz('Asia/Thimphu').format('H'), 0);
  PrevHr: number = this.CurrHr;
  NewSelectedDate = this.FormatedDate;
  CurrTime =  moment().tz('Asia/Thimphu').format('MMMM Do YYYY, h:mm:ss a').toString();

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];


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
      layers: [googleTer]
    }).setView([-41.2858, 174.78682], 14);

    L.control.layers(baselayers).addTo(this.map);



    this.stationService.getStationsData(this.FormatedDate)
      .subscribe(response => {
          this.stationsData = response;
          this.CurrentState = true;
          const colUpdate = 'UpdateCount' + moment().tz('Asia/Thimphu').format('H').toString();

          // Load Station Marker
          this.stationsData.forEach(station => {

            const htmlContent = '<span class="font-weight-bold">Code: ' + station.code + '</span><br>' +
              '<span class="font-weight-bold">Name: ' + station.name + '</span><br><br>' +
              // tslint:disable-next-line: max-line-length
              // tslint:disable-next-line: triple-equals
              'Status : ' +  (station[colUpdate] == 0 ? '<span class="badge badge-danger">Inactive</span>' :
                '<span class="badge badge-primary">Active</span>') + '<br>' +
              'Last Update: ' + (station.LatestLog === '' ? '' : this.FormatedDate + ' ' + station.LatestLog) + '<br><br>' +
              'Location : ' + station.location + '<br>' +
              'Latitude : ' + station.latitude + '<br>' +
              'Longitude : ' + station.longitude + '<br>' +
              'Elevation: ' + station.elevation + '<br>';

            const stationMarker = L.marker([station.latitude, station.longitude],
              {icon: L.AwesomeMarkers.icon({icon: 'home', prefix: 'fa', markerColor: this.getStationMarkerStatus(station[colUpdate]) })})
              .bindPopup(htmlContent).addTo(this.map);
            this.markers.push(stationMarker);
          });

          const group = new L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds());
        }
      );

    // this.startAutoRefreshData();  // Start auto refresh
    this.RefreshEverySec();

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

  getStatus(hr: number) {
    const currDate = new Date();

    if (currDate.getFullYear() === this.SelectedDate.getFullYear()
      && currDate.getMonth() === this.SelectedDate.getMonth() &&  currDate.getDay() === this.SelectedDate.getDay()) {
      if (hr > this.CurrHr) {
        return 1; // so display as outline
      }
    }
    return 0;
  }

  /*
  getBStatus(hr: number) {
    return this.CurrHr;
  }
  */

  GetUpdateCount(index: number, hr: number) {
    const colUpdate = 'UpdateCount' + hr.toString();

    return this.stationsData[index][colUpdate];
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
  }

  returnIntPrct(intensitylevel: number, hr: number) {
    let currMinutes: number  = (this.CurrentState === true && hr === this.CurrHr ? new Date().getMinutes() - 1 : 60);
    currMinutes = currMinutes * intensitylevel;   // times the value by 6 since every 10 secs there is 6 records

    return currMinutes;
  }

  getStationMarkerStatus(updateCount: number) {

    let stationStat;
    // const currHr: number = parseInt(moment().tz('Asia/Thimphu').format('H'), 0);

    switch (true) {
      // tslint:disable-next-line: triple-equals
      case updateCount == intPercentage.intRed:
        stationStat = stationMarkerStatus.stationRed;
        break;
      case (updateCount > intPercentage.intRed && updateCount < this.returnIntPrct(intPercentage.intGreen, this.CurrHr)) :
        stationStat = stationMarkerStatus.stationOrange;
        break;
      case (updateCount >= this.returnIntPrct(intPercentage.intGreen, this.CurrHr) &&
        updateCount < this.returnIntPrct(intPercentage.intOk, this.CurrHr)) :

        stationStat  = stationMarkerStatus.stationGreen;
        break;
      default:
        stationStat = stationMarkerStatus.stationOk;
        break;
    }

    return stationStat;
  }

  showData() {
    const newDate = this.NewSelectedDate.split('-');
    const currDate = new Date();

    this.CurrHr = parseInt(moment().tz('Asia/Thimphu').format('H'), 0);   // get current hour
    const colUpdate = 'UpdateCount' + this.CurrHr.toString();

    this.SelectedDate = new Date(newDate[0].toString() + '-' + newDate[1].toString() + '-' + newDate[2].toString());

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
            // tslint:disable-next-line: triple-equals
            'Status : ' +  (station[colUpdate] == 0 ? '<span class="badge badge-danger">Inactive</span>' :
              '<span class="badge badge-primary">Active</span>') + '<br>' +
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
  }

  RefreshEverySec() {
      // tslint:disable-next-line: no-unused-expression
    setInterval(() => {
      this.CurrTime = moment().tz('Asia/Thimphu').format('MMMM Do YYYY, h:mm:ss a').toString();
    }, 1000);
  }

  startAutoRefreshData() {

    this.intervalId = setInterval (() => {
      const Hr: number = parseInt(moment().tz('Asia/Thimphu').format('H'), 0);
      // const Hr: number = new Date().getHours();
      const colUpdate = 'UpdateCount' + Hr.toString();

      if (Hr !== this.CurrHr && Hr !== 0) {
        // update previous hour
        this.stationService.getStationsHrData(this.CurrHr)
        .subscribe(response => {
            this.stationsHrData = response;
            this.stationsHrData.forEach((station, index) => {
              this.stationsData[index][colUpdate] = station[colUpdate];
            });
        });
        this.CurrHr = Hr;   // Now the current hour

      }

      if (Hr !== this.CurrHr && Hr === 0) {  // Next Day, Update date
          const NewDate = new Date();
          this.NewSelectedDate = NewDate.getFullYear().toString() + '-' + (NewDate.getMonth() + 1).toString() +
            '-' + NewDate.getDate().toString();

          this.showData();   // Get latest data
      }

      this.stationService.getStationsHrData(this.CurrHr)
        .subscribe(response => {
            this.stationsHrData = response;

            // Update stations marker content
            this.stationsHrData.forEach((station, index) => {
              const htmlContent = '<span class="font-weight-bold">Code: ' + station.code + '</span><br>' +
                '<span class="font-weight-bold">Name: ' + station.name + '</span><br><br>' +
                // tslint:disable-next-line: triple-equals
                'Status : ' +  (station[colUpdate] == 0 ? '<span class="badge badge-danger">Inactive</span>' :
                  '<span class="badge badge-primary">Active</span>') + '<br>' +
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


        }
      );
      // console.log(this.stationsHrData);
      // console.log('refresh');
      // console.log(this.CurrHr);

    }, 15000);
  }



}
