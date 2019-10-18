import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private baseUrl = 'http://localhost/bhutan_stations/api/station/';
  private urlStation = this.baseUrl + 'stations.php';
  private urlStationData =  this.baseUrl + 'intensity_data.php';
  private urlStationHrData =  this.baseUrl + 'intensity_data_hr.php';
  private urlStationDetials =  this.baseUrl + 'station_single.php';
  private urlAddStation =  this.baseUrl + 'station_add.php';
  private urlUpdateStation =  this.baseUrl + 'station_update.php';
  private urlDeleteStation =  this.baseUrl + 'station_delete.php';

constructor(private http: HttpClient) { }

  getStations() {
    return this.http.get(this.urlStation);
  }

  getStationsData(currDate: any) {
    return this.http.get(this.urlStationData + '?selected_date=' + currDate);
  }
  getStationsHrData() {
    return this.http.get(this.urlStationHrData);
  }

  getStationDetials(stationId: string) {
    return this.http.get(this.urlStationDetials + '?stationID=' + stationId);
  }

  addStation(station: any) {
    return this.http.post(this.urlAddStation, station);
  }

  updateStation(station: any) {
    return this.http.put(this.urlUpdateStation, station);
  }

  deleteStation(station: any) {
    return this.http.put(this.urlDeleteStation, station);
  }
}
