import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device} from '../models/device';
import {Tester} from '../models/tester';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/testers/countries`);
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.url}/devices`);
  }

  getTestersBy(params): Observable<Tester[]> {
    return this.http.get<Tester[]>(`${this.url}/testers`, {params});
  }

}
