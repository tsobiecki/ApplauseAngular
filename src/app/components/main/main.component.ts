import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Device} from '../../models/device';
import {Tester} from '../../models/tester';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  devices: Device[];
  countries: string[];
  testers: Tester[];

  testersForm = new FormGroup({
    countries: new FormControl(false),
    deviceIds: new FormControl(false)
  });

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getDevices().subscribe(res => this.devices = res);
    this.apiService.getCountries().subscribe(res => this.countries = res);
  }

  getTesters() {
    let countries = this.testersForm.value.countries;
    let deviceIds = this.testersForm.value.deviceIds;
    if (countries.length === 0) {
      countries = false;
    }
    if (deviceIds.length === 0) {
      deviceIds = false;
    }
    this.apiService.getTestersBy({
      countries: countries ? countries.join(',') : [],
      deviceIds: deviceIds ? deviceIds.map(device => device.id).join(',') : []
    }).subscribe(res => this.testers = res);

  }
}
