import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';
import { environment } from '../../../environments/environment';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/documents';

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

  it('should return documents with pagination query', () => {
    const dummyDocuments: DocumentResponseInterface[] = [
      { id: 1, name: 'Document 1', filePath: '/path/to/document1', categoryIds: [1], read: false, visible: true },
      { id: 2, name: 'Document 2', filePath: '/path/to/document2', categoryIds: [2], read: true, visible: true },
    ];
    const dummyTotalElements = '2';
    const dummyPaginationQuery: PaginationQueryParamsInterface = { pageNumber: '0', pageSize: '20' };

    service.getDocumentsWithQuery({ queryParams: dummyPaginationQuery }).subscribe(response => {
      expect(response.documents.length).toBe(2);
      expect(response.documents).toEqual(dummyDocuments);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl + `?page=${dummyPaginationQuery.pageNumber}&size=${dummyPaginationQuery.pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyDocuments, totalElements: dummyTotalElements });
  });
});
