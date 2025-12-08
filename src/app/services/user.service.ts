import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'token': token || ''
    });
  }

  list(search: string = ''): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/list?search=${search}`, {
      headers: this.getHeaders()
    });
  }

  register(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register_admin`, userData, {
      headers: this.getHeaders()
    });
  }

  update(userData: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, userData, {
      headers: this.getHeaders()
    });
  }

  delete(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete?_id=${userId}`, {
      headers: this.getHeaders()
    });
  }
}