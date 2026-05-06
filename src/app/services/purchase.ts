import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Config } from './config';

@Injectable({
  providedIn: 'root',
})
export class Purchase {
  private baseUrl = environment.apiUrl + '/api/purchases';

  // cache
  private dataSubject: { [key: string]: BehaviorSubject<any[]> } = {};
  // data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private config: Config,
  ) {}

  // private get baseUrl(): string {
  //   return `${this.config.apiUrl}/api/purchases`;
  // }
  create(data: any) {
    return this.http.post(this.baseUrl, data);
  }
  update(data: any) {
    return this.http.put(`${this.baseUrl}/${data.id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getByDate(startDate: string, endDate: string) {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);

    return this.http.get<any[]>(`${this.baseUrl}/by-date`, { params });
  }

  getByName(customerName: string) {
    const params = new HttpParams().set('customerName', customerName);

    return this.http.get<any[]>(`${this.baseUrl}/by-name`, { params });
  }

  private formData: { [key: string]: any } = {};

  // save form
  setFormData(key: string, data: any) {
    this.formData[key] = data;
  }

  // get form
  getFormData(key: string) {
    return this.formData[key] || null;
  }

  // set cache
  setData(key: string, data: any[]) {
    if (!this.dataSubject[key]) {
      this.dataSubject[key] = new BehaviorSubject<any[]>([]);
    }
    this.dataSubject[key].next(data);
  }

  // get current cache value
  getData$(key: string) {
    if (!this.dataSubject[key]) {
      this.dataSubject[key] = new BehaviorSubject<any[]>([]);
    }
    return this.dataSubject[key].asObservable();
  }
  clearCache() {
    // clear BehaviorSubjects
    Object.keys(this.dataSubject).forEach((key) => {
      this.dataSubject[key].next([]); // reset data
    });

    // clear stored references
    this.dataSubject = {};

    // clear form data
    this.formData = {};
  }
}
