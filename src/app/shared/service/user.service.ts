import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserResponseInterface } from '../../admin-view/type/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all users from the backend.
   * @returns An observable of an array of category response objects.
   */
  fetchAllUsers(): Observable<UserResponseInterface[]> {
    const queryParamRetrieveAll: string = '?page=0&size=1000';
    const fullUrl = this.baseUrl + queryParamRetrieveAll;
    return this.http.get<{ content: UserResponseInterface[] }>(fullUrl).pipe(map(response => response.content));
  }
}
