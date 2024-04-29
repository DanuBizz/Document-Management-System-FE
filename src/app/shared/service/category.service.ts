import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, map, Observable} from 'rxjs';
import {CategoryResponseInterface} from '../../admin-view/type/category-response.interface';
import {environment} from '../../../environments/environment';
import {PaginationQueryParamsInterface} from '../type/pagination-query-params.interface';
import {CategoryRequestInterface} from "../../admin-view/type/category-request.interface";

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
   * @param queryParams Pagination parameters including pageNumber and pageSize.
   * @returns Observable emitting documents array and total number of elements.
   */
  fetchCategoriesWithQuery(queryParams: {
    queryParams: PaginationQueryParamsInterface;
  }): Observable<{ categories: CategoryResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: CategoryResponseInterface[]; totalElements: string }>(this.baseUrl, {
        params: {
          page: queryParams.queryParams.pageNumber,
          size: queryParams.queryParams.pageSize,
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
   * Upon successful creation, returns an observable containing a success message.
   * @param newCategory The data of the new category to be created.
   * @returns An observable containing a success message upon successful creation.
   */
  createCategory(newCategory: CategoryRequestInterface): Observable<{message: string}> {
    return this.http
        .post<{ message: string }>(this.baseUrl, newCategory)
        .pipe(
            map(() => ({ message: 'Erfolgreich hochgeladen' }))
        );
  }

}
