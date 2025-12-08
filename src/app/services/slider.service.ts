import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slider } from '../models/slider.model';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private apiUrl = 'http://localhost:3000/api/sliders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(search: string = ''): Observable<{ sliders: Slider[] }> {
    return this.http.get<{ sliders: Slider[] }>(`${this.apiUrl}/list?search=${search}`, {
      headers: this.getHeaders()
    });
  }

  register(formData: FormData): Observable<Slider> {
    return this.http.post<Slider>(`${this.apiUrl}/register`, formData, {
      headers: this.getHeaders()
    });
  }

  update(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, formData, {
      headers: this.getHeaders()
    });
  }

  delete(sliderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${sliderId}`, {
      headers: this.getHeaders()
    });
  }
}