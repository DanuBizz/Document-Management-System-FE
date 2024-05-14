import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl: string = environment.apiUrl + '/documentVersions';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  fetchFile(id: number): Observable<Blob> {
    return this.http.get(this.baseUrl + `/${id}/file`, { responseType: 'blob' }).pipe(
      map(response => {
        return response as Blob;
      })
    );
  }

  getFileUrl(file: Blob): SafeResourceUrl {
    const unsafeUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
}
