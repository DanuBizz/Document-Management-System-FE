import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DocVersionRequest } from '../../admin-view/type/doc-version-request.interface';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DocVersionService {
  private baseUrl: string = environment.apiUrl + '/documents';

  constructor(private http: HttpClient) {}

  createDocVersion(newDocumentVersion: DocVersionRequest) {
    return this.http
      .post<{ content: DocumentResponseInterface[]; totalElements: string }>(this.baseUrl, newDocumentVersion)
      .pipe(tap(() => console.log('successfully uploaded new document version')));
  }
}
