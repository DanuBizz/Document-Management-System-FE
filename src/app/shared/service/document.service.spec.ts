import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { DocumentResponseInterface } from '../../admin-view/type/document-response.interface';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';
import { environment } from '../../../environments/environment';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/documentVersions';

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
      {
        id: 1,
        documentName: 'Document 1',
        filePath: '/path/to/document1',
        timestamp: new Date(),
        categoryNames: ['Category 1'],
        isRead: true,
        isLatest: true,
        isVisible: true,
      },
      {
        id: 2,
        documentName: 'Document 2',
        filePath: '/path/to/document2',
        timestamp: new Date(),
        categoryNames: ['Category 1'],
        isRead: true,
        isLatest: true,
        isVisible: true,
      },
    ];
    const dummyTotalElements = '2';
    const dummyPaginationQuery: PaginationQueryParamsInterface = { pageNumber: '0', pageSize: '20' };

    service.fetchDocumentsWithQuery({ queryParams: dummyPaginationQuery }).subscribe(response => {
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
