import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Variedad } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(search: string = '', categorie: string = ''): Observable<{ products: Product[] }> {
    let url = `${this.apiUrl}/list?search=${search}`;
    if (categorie) {
      url += `&categorie=${categorie}`;
    }
    return this.http.get<{ products: Product[] }>(url, {
      headers: this.getHeaders()
    });
  }

  show(productId: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.apiUrl}/show/${productId}`, {
      headers: this.getHeaders()
    });
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData, {
      headers: this.getHeaders()
    });
  }

  update(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, formData, {
      headers: this.getHeaders()
    });
  }

  delete(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${productId}`, {
      headers: this.getHeaders()
    });
  }

  registerImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register_imagen`, formData, {
      headers: this.getHeaders()
    });
  }

  removeImagen(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove_imagen`, data, {
      headers: this.getHeaders()
    });
  }

  // Variedad methods
  registerVariedad(data: Variedad): Observable<{ variedad: Variedad }> {
    return this.http.post<{ variedad: Variedad }>(`${this.apiUrl}/register-variedad`, data, {
      headers: this.getHeaders()
    });
  }

  updateVariedad(data: Variedad): Observable<{ variedad: Variedad }> {
    return this.http.put<{ variedad: Variedad }>(`${this.apiUrl}/update-variedad`, data, {
      headers: this.getHeaders()
    });
  }

  deleteVariedad(variedadId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-variedad/${variedadId}`, {
      headers: this.getHeaders()
    });
  }
}