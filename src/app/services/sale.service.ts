import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SaleDetailResponse } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/api/sale';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  // Listar todas las ventas
  listAll(): Observable<{ sales: Sale[] }> {
    return this.http.get<{ sales: Sale[] }>(`${this.apiUrl}/list-all`, {
      headers: this.getHeaders()
    });
  }

  // Ver detalle de una venta
  show(saleId: string): Observable<SaleDetailResponse> {
    return this.http.get<SaleDetailResponse>(`${this.apiUrl}/show/${saleId}`, {
      headers: this.getHeaders()
    });
  }

  // Estadísticas del dashboard
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    });
  }
}