import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Config } from './config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private config: Config,
  ) {}
  // private get baseUrl(): string {
  //   return `${this.config.apiUrl}`;
  // }
  login(data: any) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, data, { responseType: 'text' });
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/api/auth/register`, data);
  }
  //
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
