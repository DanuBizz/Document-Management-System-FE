import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl: string = environment.apiUrl + '/categories';
  private queryParam: string = '?page=0&size=20&sort=asc';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all categories from the backend.
   * @returns An observable of an array of category response objects.
   */
  getAllCategories(): Observable<CategoryResponseInterface[]> {
    const fullUrl = this.baseUrl + this.queryParam;
    return this.http.get<{ content: CategoryResponseInterface[] }>(fullUrl).pipe(
      delay(3000), // Simulate delay for demonstration purposes
      map(response => response.content)
    );
  }
}
