import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { map, Observable } from 'rxjs';
import { AuthResponseInterface } from '../type/auth-response.interface';
import { LoginRequestInterface } from '../type/login-request.interface';

@Injectable({
  providedIn: 'root',
})
//AuthService provides authentication-related functionalities.
export class AuthService {
  testApiUrl = 'https://api.realworld.io/api';
  authUrl = 'http://localhost:8080'

  /**
   * @param http HttpClient instance for making HTTP requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Performs user login.
   * @param data LoginRequestInterface containing user credentials
   * @returns Observable of CurrentUserInterface
   */
  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = this.authUrl;

    return this.http.post<CurrentUserInterface>(url, data).pipe(map(response => response));
  }

  /**
   * Fetching the current user response.
   * @returns Observable of AuthResponseInterface
   */
  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = this.authUrl + `/users`;

    return this.http.get<AuthResponseInterface>(url).pipe(map(response => response.user));
  }
}
