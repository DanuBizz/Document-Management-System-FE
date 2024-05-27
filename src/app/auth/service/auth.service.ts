import { Injectable } from '@angular/core';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { map, Observable, of } from 'rxjs';
import { LoginRequestInterface } from '../type/login-request.interface';
import { environment } from '../../../environments/environment';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root',
})
//AuthService provides authentication-related functionalities.
export class AuthService {
  authUrl = environment.apiUrl + '/usercontrol';
  /**
   * @param http HttpClient instance for making HTTP requests
   * @param persistenceService
   */
  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService
  ) {}

  /**
   * Performs user login.
   * @param data LoginRequestInterface containing user credentials
   * @returns Observable of CurrentUserInterface
   */
  login(data: LoginRequestInterface): Observable<HttpStatusCode> {
    return this.http.post<HttpStatusCode>(this.authUrl, data).pipe(
      map(response => {
        console.log(response);
        return response;
      })
    );
  }

  /**
   * Fetching the current user response.
   * @returns Observable of AuthResponseInterface
   */
  getCurrentUser(encodedUsername: string): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/users/user/coded/${encodedUsername}`;
    return this.http.get<CurrentUserInterface>(url);
  }

  logout(): Observable<null> {
    this.persistenceService.remove('accessToken');
    return of(null);
  }
}
