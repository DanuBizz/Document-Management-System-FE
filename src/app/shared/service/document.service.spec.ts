import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService],
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return documents', () => {
    const dummyDocuments: DocumentResponseInterface[] = [
      { id: 1, name: 'Document 1', filePath: '/path/to/document1', categoryIds: [1], read: false, visible: true },
      { id: 2, name: 'Document 2', filePath: '/path/to/document2', categoryIds: [2], read: true, visible: true },
    ];

    service.getDocuments().subscribe(documents => {
      expect(documents.length).toBe(2);
      expect(documents).toEqual(dummyDocuments);
    });

    const req = httpMock.expectOne('http://localhost:8080/documents?page=0&size=20&sort=asc');
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyDocuments });
  });
});
