import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl: string = environment.apiUrl + '/documents';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  fetchFile(id: number): Observable<File[]> {
    return this.http.get<File[]>(this.baseUrl + `/${id}`).pipe(map(response => response));
  }

  getFileUrl(file: File): SafeResourceUrl {
    const unsafeUrl = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
}
