import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';
import { environment } from '../../../environments/environment';
import { CategoryRequestInterface } from '../../admin-view/type/category-request.interface';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl: string = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all categories from the backend.
   * @returns An observable of an array of category response objects.
   */
  fetchAllCategories(): Observable<CategoryResponseInterface[]> {
    const queryParamRetrieveAll: string = '?page=0&size=1000';
    const fullUrl = this.baseUrl + queryParamRetrieveAll;
    return this.http.get<{ content: CategoryResponseInterface[] }>(fullUrl).pipe(map(response => response.content));
  }

  /**
   * Retrieves categories from the server based on pagination parameters.
   *
   * @returns Observable emitting documents array and total number of elements.
   * @param pagination includes the page number, page size, and sort order.
   */
  fetchCategoriesWithQuery(
    pagination: PaginationQueryParamsInterface
  ): Observable<{ categories: CategoryResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: CategoryResponseInterface[]; totalElements: string }>(this.baseUrl, {
        params: {
          page: pagination.pageNumber,
          size: pagination.pageSize,
          sort: pagination.sort,
        },
      })
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          categories: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }

  /**
   * Method to create a new category.
   * @param newCategory The data of the new category to be created.
   * @returns An observable containing a success message upon successful creation.
   */
  createCategory(newCategory: CategoryRequestInterface): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(this.baseUrl, newCategory)
      .pipe(map(() => ({ message: 'Erfolgreich hochgeladen' })));
  }

  /**
   * Method to update the users of an existing category.
   * @returns An observable containing a success message upon successful creation.
   */
  updateCategoryUsers(id: number, userIds: number[]): Observable<{ message: string }> {
    console.log(userIds);
    return this.http
      .put<{ message: string }>(this.baseUrl + `/${id}`, { userIds: userIds })
      .pipe(map(() => ({ message: 'Erfolgreich geändert' })));
  }
}
