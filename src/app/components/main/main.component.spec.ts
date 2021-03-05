import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';
import {ApiService} from '../../services/api.service';
import {of} from 'rxjs';
import {Device} from '../../models/device';
import {By} from '@angular/platform-browser';
import {MaterialModule} from '../../utils/material/material.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Tester} from '../../models/tester';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ApiService],
      declarations: [MainComponent],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    apiService = TestBed.inject(ApiService);
    component = fixture.componentInstance;
  });

  it('should map devices', () => {
    const device1 = new Device(1, 'Device 1');
    const device2 = new Device(2, 'Device 2');

    spyOn(apiService, 'getDevices').and.returnValue(of([device1, device2]));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.devices')).map(value => value.nativeElement.textContent.trim())).toEqual([device1.deviceName, device2.deviceName]);
  });

  it('should map countries', () => {
    const countries = ['US', 'GB'];

    spyOn(apiService, 'getCountries').and.returnValue(of(countries));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.countries')).map(value => value.nativeElement.textContent.trim())).toEqual(countries);
  });

  it('should include country as request parameter', () => {
    const countries = ['US'];

    const spy = spyOn(apiService, 'getTestersBy').and.returnValue(of([]));

    spyOn(apiService, 'getCountries').and.returnValue(of(countries));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#country-US')).nativeElement.click();
    fixture.debugElement.query(By.css('#submit-btn')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith({countries: 'US', deviceIds: []});
  });

  it('should include device as request parameter', () => {
    const devices = [new Device(1, 'Device 1')];

    const spy = spyOn(apiService, 'getTestersBy').and.returnValue(of([]));

    spyOn(apiService, 'getDevices').and.returnValue(of(devices));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#device-1')).nativeElement.click();
    fixture.debugElement.query(By.css('#submit-btn')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith({countries: [], deviceIds: '1'});
  });

  it('should send country and device id as request parameters', () => {
    const countries = ['US'];
    const devices = [new Device(1, 'Device 1')];

    const spy = spyOn(apiService, 'getTestersBy').and.returnValue(of([]));

    spyOn(apiService, 'getCountries').and.returnValue(of(countries));
    spyOn(apiService, 'getDevices').and.returnValue(of(devices));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#country-US')).nativeElement.click();
    fixture.debugElement.query(By.css('#device-1')).nativeElement.click();
    fixture.debugElement.query(By.css('#submit-btn')).nativeElement.click();

    expect(spy).toHaveBeenCalledWith({countries: 'US', deviceIds: '1'});
  });

  it('should display testers for given criteria', () => {
    const countries = ['US'];
    const devices = [new Device(1, 'Device 1')];

    spyOn(apiService, 'getTestersBy').and.returnValue(of([new Tester('Tester1', 40)]));

    spyOn(apiService, 'getCountries').and.returnValue(of(countries));
    spyOn(apiService, 'getDevices').and.returnValue(of(devices));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#country-US')).nativeElement.click();
    fixture.debugElement.query(By.css('#device-1')).nativeElement.click();
    fixture.debugElement.query(By.css('#submit-btn')).nativeElement.click();

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#tester-Tester1')).nativeElement.textContent).toEqual('Tester Tester1 has found 40 bugs!');
  });
});
