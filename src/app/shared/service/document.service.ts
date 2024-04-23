import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documentsBaseUrl: string = 'http://localhost:8080/documents';
  private queryParam: string = '?page=0&size=20&sort=asc';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<DocumentResponseInterface[]> {
    const fullUrl = this.documentsBaseUrl + this.queryParam;
    return this.http.get<{ content: DocumentResponseInterface[] }>(fullUrl).pipe(
      delay(3000),
      map(response => response.content)
    );
  }
}
