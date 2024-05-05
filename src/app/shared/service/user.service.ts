import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {delay, map, Observable} from 'rxjs';
import {UserResponseInterface} from '../../admin-view/type/user-response.interface';
import {PaginationQueryParamsInterface} from '../type/pagination-query-params.interface';

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

  /**
   * Retrieves users from the server based on pagination parameters.
   *
   * @param queryParams Pagination parameters including pageNumber and pageSize.
   * @returns Observable emitting users array and total number of elements.
   */
  fetchUsersWitQuery(queryParams: {
    queryParams: PaginationQueryParamsInterface;
  }): Observable<{ users: UserResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: UserResponseInterface[]; totalElements: string }>(this.baseUrl, {
        params: {
          page: queryParams.queryParams.pageNumber,
          size: queryParams.queryParams.pageSize,
        },
      })
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          users: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }
}
