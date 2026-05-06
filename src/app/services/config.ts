import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Config {
  private config: any;
  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http
      .get('/assets/config/config.json')
      .toPromise()
      .then((config) => {
        this.config = config;
      }) as Promise<void>;
  }
  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
