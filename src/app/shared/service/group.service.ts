import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { QueryParamsInterface } from '../type/query-params.interface';
import { GroupResponseInterface } from '../../admin-view/type/group-response-interface';
import { GroupRequestInterface } from '../../admin-view/type/group-request.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private baseUrl: string = environment.apiUrl + '/groups';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all groups from the backend.
   * @returns An observable of an array of groups response objects.
   */
  fetchAllGroups(): Observable<GroupResponseInterface[]> {
    const queryParamRetrieveAll: string = '?page=0&size=1000';
    const fullUrl = this.baseUrl + queryParamRetrieveAll;
    return this.http.get<{ content: GroupResponseInterface[] }>(fullUrl).pipe(map(response => response.content));
  }

  /**
   * Retrieves groups from the server based on pagination parameters.
   *
   * @returns Observable emitting groups array and total number of elements.
   * @param queryParams includes the page number, page size, sort order and search string.
   */
  fetchGroupsWithQuery(
    queryParams: QueryParamsInterface
  ): Observable<{ groups: GroupResponseInterface[]; totalElements: string }> {
    const params = new HttpParams()
      .set('search', queryParams.search)
      .set('page', queryParams.pageNumber)
      .set('size', queryParams.pageSize)
      .set('sort', queryParams.sort);

    return this.http
      .get<{ content: GroupResponseInterface[]; totalElements: string }>(this.baseUrl + `/search`, { params })
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          groups: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }

  /**
   * Method to create a new group.
   * @param name
   */
  createGroup(name: string) {
    const newGroup: GroupRequestInterface = {
      name: name,
      usernames: [],
    };
    return this.http.post<{ message: string }>(this.baseUrl, newGroup);
  }
}
