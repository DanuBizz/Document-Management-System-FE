import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';
import { environment } from '../../../environments/environment';
import { CategoryRequestInterface } from '../../admin-view/type/category-request.interface';
import { QueryParamsInterface } from '../type/query-params.interface';

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
   * Retrieves categories from the server based on queryParams parameters.
   *
   * @returns Observable emitting documents array and total number of elements.
   * @param queryParams includes the page number, page size, sort order and search string.
   */
  fetchCategoriesWithQuery(
    queryParams: QueryParamsInterface
  ): Observable<{ categories: CategoryResponseInterface[]; totalElements: string }> {
    const params = new HttpParams()
      .set('search', queryParams.search)
      .set('page', queryParams.pageNumber)
      .set('size', queryParams.pageSize)
      .set('sort', queryParams.sort);

    return this.http
      .get<{ content: CategoryResponseInterface[]; totalElements: string }>(this.baseUrl + `/search`, { params })
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
  createCategory(newCategory: CategoryRequestInterface) {
    return this.http
      .post(this.baseUrl, newCategory);
  }

  /**
   * Method to update the users of an existing category.
   * @returns An observable containing a success message upon successful creation.
   */
  updateCategoryUsers(id: number, category: CategoryRequestInterface) {
    return this.http
      .put(this.baseUrl + `/${id}`, category);
  }
}
