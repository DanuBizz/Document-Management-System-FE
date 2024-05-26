import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentRequestInterface } from '../../admin-view/type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../admin-view/type/document-versions-response.interface';
import { QueryParamsInterface } from '../type/query-params.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl: string = environment.apiUrl + '/documentVersions';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves documents and their associated versions from the server based on queryParams parameters.
   *
   * @returns Observable emitting documents array and total number of elements.
   * @param queryParams includes the page number, page size, and sort order.
   */
  fetchDocumentsWithAssociatedVersionsWithQuery(
    queryParams: QueryParamsInterface
  ): Observable<{ documents: DocumentVersionsResponseInterface[]; totalElements: string }> {
    return this.http
      .get<{ content: DocumentVersionsResponseInterface[]; totalElements: string }>(
        this.baseUrl + '/latest-with-associated-versions',
        {
          params: {
            page: queryParams.pageNumber,
            size: queryParams.pageSize,
            sort: queryParams.sort,
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
   * @param newDocumentVersion The data of the new category to be created.
   * @returns An boolean if email has sent or not
   */
  createDocVersion(newDocumentVersion: DocumentRequestInterface): Observable<{ emailSent: boolean }> {
    const formData = new FormData();
    formData.append('file', newDocumentVersion.file);
    formData.append('name', newDocumentVersion.name);
    formData.append('timestamp', newDocumentVersion.timestamp.toISOString().substring(0, 19));
    newDocumentVersion.categoryIds.forEach(id => {
      formData.append('categoryIds[]', id.toString());
    });

    return this.http
      .post<{ emailSent: boolean }>(this.baseUrl, formData)
      .pipe(map(response => ({ emailSent: response.emailSent })));
  }

  /**
   * Updates the visibility of a document with the specified ID.
   * @param id The ID of the document whose visibility should be updated.
   * @return An Observable that emits a success message upon successful update.
   */
  updateDocumentVisibility(id: number) {
    return this.http.put(this.baseUrl + `/${id}/toggle-visibility`, null);
  }
}
