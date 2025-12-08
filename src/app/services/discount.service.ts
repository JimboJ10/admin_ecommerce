import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from '../models/discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'http://localhost:3000/api/discount';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(): Observable<{ discounts: Discount[] }> {
    return this.http.get<{ discounts: Discount[] }>(`${this.apiUrl}/list`, {
      headers: this.getHeaders()
    });
  }

  register(discountData: Discount): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, discountData, {
      headers: this.getHeaders()
    });
  }

  update(discountData: Discount): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, discountData, {
      headers: this.getHeaders()
    });
  }

  delete(discountId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${discountId}`, {
      headers: this.getHeaders()
    });
  }

  show(discountId: string): Observable<{ discount: Discount }> {
    return this.http.get<{ discount: Discount }>(`${this.apiUrl}/show?discount_id=${discountId}`, {
      headers: this.getHeaders()
    });
  }

  config(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config`, {
      headers: this.getHeaders()
    });
  }
}