import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { UserResponseInterface } from '../../admin-view/type/user-response.interface';
import { QueryParamsInterface } from '../type/query-params.interface';

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
    const queryParams: string = '?page=0&size=1000&sort=username,asc';
    const fullUrl = this.baseUrl + queryParams;
    return this.http.get<{ content: UserResponseInterface[] }>(fullUrl).pipe(map(response => response.content));
  }

  /**
   * Retrieves users from the server based on queryParams parameters.
   *
   * @returns Observable emitting users array and total number of elements.
   * @param queryParams includes the page number, page size, and sort order and search string.
   */
  fetchUsersWitQuery(
    queryParams: QueryParamsInterface
  ): Observable<{ users: UserResponseInterface[]; totalElements: string }> {
    const params = new HttpParams()
      .set('search', queryParams.search)
      .set('page', queryParams.pageNumber)
      .set('size', queryParams.pageSize)
      .set('sort', queryParams.sort);

    return this.http
      .get<{ content: UserResponseInterface[]; totalElements: string }>(this.baseUrl + `/search`, { params })
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          users: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }

  /**
   * Updates the role of a user based on their ID.
   *
   * @param id The ID of the user whose role needs to be updated.
   * @param isAdmin A boolean value indicating whether the user should be granted admin rights or not.
   *
   * @returns An Observable with a message indicating the success of the operation.
   */
  updateUserRole(id: number, isAdmin: boolean) {
    return this.http
      .put<{ message: string }>(this.baseUrl + `/${id}/toggle-admin`, { isAdmin: isAdmin })
      .pipe(map(() => ({ message: 'Erfolgreich geändert' })));
  }
}
