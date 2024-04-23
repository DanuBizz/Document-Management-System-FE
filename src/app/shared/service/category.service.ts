import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private documentsBaseUrl: string = 'http://localhost:8080/categories';
  private queryParam: string = '?page=0&size=20&sort=asc';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoryResponseInterface[]> {
    const fullUrl = this.documentsBaseUrl + this.queryParam;
    return this.http.get<{ content: CategoryResponseInterface[] }>(fullUrl).pipe(
      delay(3000),
      map(response => response.content)
    );
  }
}
