import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(search: string = ''): Observable<{ categories: Categorie[] }> {
    return this.http.get<{ categories: Categorie[] }>(`${this.apiUrl}/list?search=${search}`, {
      headers: this.getHeaders()
    });
  }

  register(formData: FormData): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/register`, formData, {
      headers: this.getHeaders()
    });
  }

  update(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, formData, {
      headers: this.getHeaders()
    });
  }

  delete(categorieId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${categorieId}`, {
      headers: this.getHeaders()
    });
  }
}