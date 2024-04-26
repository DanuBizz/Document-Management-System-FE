import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private baseUrl: string = environment.apiUrl + '/documents';
  private queryParam: string = '?page=0&size=20&sort=asc';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all documents from the backend.
   * @returns An observable of an array of document response objects.
   */
  getDocuments(): Observable<DocumentResponseInterface[]> {
    const fullUrl = this.baseUrl + this.queryParam;
    return this.http.get<{ content: DocumentResponseInterface[] }>(fullUrl).pipe(
      delay(3000), // Simulate delay for demonstration purposes
      map(response => response.content)
    );
  }
}
