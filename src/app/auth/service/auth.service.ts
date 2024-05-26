import { Injectable } from '@angular/core';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { CurrentUserInterface } from '../../shared/type/current-user.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoginRequestInterface } from '../type/login-request.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
//AuthService provides authentication-related functionalities.
export class AuthService {
  authUrl = 'http://localhost:8080/usercontrol'
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  /**
   * @param http HttpClient instance for making HTTP requests
   */
  constructor(private http: HttpClient) {}
  updateLoggedInStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }
  /**
   * Performs user login.
   * @param data LoginRequestInterface containing user credentials
   * @returns Observable of CurrentUserInterface
   */
  login(data: LoginRequestInterface): Observable<HttpStatusCode> {
    const url = this.authUrl;

    return this.http.post<HttpStatusCode>(url, data).pipe( map(response => {
      console.log('Response from login:', response);
      return response;
    }));
  }

  /**
   * Fetching the current user response.
   * @returns Observable of AuthResponseInterface
   */
  getCurrentUser(encodedUsername: string): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + `/users/user/coded/${encodedUsername}`;
    return this.http.get<CurrentUserInterface>(url);
  }

  logout(): Observable<{ message: string }> {
    const url = `${this.authUrl}/logout`;
    console.log('Logging out...');
    return this.http.get<{ message: string }>(url, {}).pipe(
      map(response => {
        localStorage.removeItem('accessToken');
        console.log('Response from logout:', response);
        return response;
      })
    );
  }
}
