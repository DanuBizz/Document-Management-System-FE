import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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
   * Retrieves the CSRF token from the backend.
   * @returns Observable of void
   */
  getCsrfToken(): Observable<void> {
    const csrfUrl = environment.apiUrl + '/usercontrol/csrf';
    return this.http.get(csrfUrl, { responseType: 'text' }).pipe(
      map((csrfToken: string) => {
        this.persistenceService.set('csrfToken', csrfToken);
      })
    );
  }

  /**
   * Performs user login.
   * @param data LoginRequestInterface containing user credentials
   * @returns Observable of CurrentUserInterface
   */
  login(data: LoginRequestInterface): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.authUrl, data);
  }

  /**
   * Fetching the current user response.
   * @returns Observable of AuthResponseInterface
   */
  getCurrentUser(encodedUsername: string): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/users/user/coded/${encodedUsername}`;
    return this.http.get<CurrentUserInterface>(url);
  }
  /**
   * Performs user logout.
   * @returns Observable of void
   */
  logout(): Observable<null> {
    this.persistenceService.remove('accessToken');
    return of(null);
  }
}
