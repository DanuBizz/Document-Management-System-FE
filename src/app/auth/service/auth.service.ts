import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CurrentUserInterface} from "../../shared/type/current-user.interface";
import {map, Observable} from "rxjs";
import {AuthResponseInterface} from "../type/auth-response.interface";
import {LoginRequestInterface} from "../type/login-request.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  testApiUrl = 'https://api.realworld.io/api';

  constructor(private http: HttpClient) {
  }

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = this.testApiUrl + '/users/login';

    return this.http.post<AuthResponseInterface>(url, data)
      .pipe(
        map((response) => response.user));
  }

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = this.testApiUrl + '/user';

    return this.http.get<AuthResponseInterface>(url)
      .pipe(
        map((response) => response.user));
  }


}
