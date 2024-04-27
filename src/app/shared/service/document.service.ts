import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';
import { environment } from '../../../environments/environment';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl: string = environment.apiUrl + '/documents';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves documents from the server based on pagination parameters.
   *
   * @param queryParams Pagination parameters including pageNumber and pageSize.
   * @returns Observable emitting documents array and total number of elements.
   */
  fetchDocumentsWithQuery(queryParams: {
    queryParams: PaginationQueryParamsInterface;
  }): Observable<{ documents: DocumentResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: DocumentResponseInterface[]; totalElements: string }>(this.baseUrl, {
        params: {
          page: queryParams.queryParams.pageNumber,
          size: queryParams.queryParams.pageSize,
        },
      })
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          documents: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }
}
