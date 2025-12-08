import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cupone } from '../models/cupone.model';

@Injectable({
  providedIn: 'root'
})
export class CuponeService {
  private apiUrl = 'http://localhost:3000/api/cupones';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(search: string = ''): Observable<{ cupones: Cupone[] }> {
    return this.http.get<{ cupones: Cupone[] }>(`${this.apiUrl}/list?search=${search}`, {
      headers: this.getHeaders()
    });
  }

  register(cuponeData: Cupone): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, cuponeData, {
      headers: this.getHeaders()
    });
  }

  update(cuponeData: Cupone): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, cuponeData, {
      headers: this.getHeaders()
    });
  }

  delete(cuponeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${cuponeId}`, {
      headers: this.getHeaders()
    });
  }

  show(cuponeId: string): Observable<{ cupon: Cupone }> {
    return this.http.get<{ cupon: Cupone }>(`${this.apiUrl}/show?cupone_id=${cuponeId}`, {
      headers: this.getHeaders()
    });
  }

  config(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config`, {
      headers: this.getHeaders()
    });
  }
}