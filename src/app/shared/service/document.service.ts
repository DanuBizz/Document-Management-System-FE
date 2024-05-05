import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';
import { DocumentRequestInterface } from '../../admin-view/type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../admin-view/type/document-versions-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl: string = environment.apiUrl + '/documentVersions';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves documents and their associated versions from the server based on pagination parameters.
   *
   * @param queryParams Pagination parameters including pageNumber and pageSize.
   * @returns Observable emitting documents array and total number of elements.
   */
  fetchDocumentsWithAssociatedVersionsWithQuery(queryParams: {
    queryParams: PaginationQueryParamsInterface;
  }): Observable<{ documents: DocumentVersionsResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: DocumentVersionsResponseInterface[]; totalElements: string }>(
        this.baseUrl + '/latest-with-associated-versions',
        {
          params: {
            page: queryParams.queryParams.pageNumber,
            size: queryParams.queryParams.pageSize,
          },
        }
      )
      .pipe(
        delay(1000), // Simulate delay for demonstration purposes
        map(response => ({
          documents: response.content,
          totalElements: response.totalElements.toString(),
        }))
      );
  }

  /**
   * Method to create a new document.
   * Creates a form data to transfer a file into a POST request.
   * Upon successful creation, returns an observable containing a success message.
   * @param newDocumentVersion The data of the new category to be created.
   * @returns An observable containing a success message upon successful creation.
   */
  createDocVersion(newDocumentVersion: DocumentRequestInterface): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', newDocumentVersion.file);
    formData.append('name', newDocumentVersion.name);
    formData.append('timestamp', newDocumentVersion.timestamp.toISOString());
    newDocumentVersion.categoryIds.forEach(id => {
      formData.append('categoryIds[]', id.toString());
    });

    return this.http
      .post<{ message: string }>(this.baseUrl, newDocumentVersion)
      .pipe(map(() => ({ message: 'Erfolgreich hochgeladen' })));
  }

  /**
   * Updates the visibility of a document with the specified ID.
   * @param id The ID of the document whose visibility should be updated.
   * @return An Observable that emits a success message upon successful update.
   */
  updateDocumentVisibility(id: number): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(this.baseUrl + `/${id}/toggle-visibility`, null)
      .pipe(map(() => ({ message: 'Erfolgreich geändert' })));
  }
}
