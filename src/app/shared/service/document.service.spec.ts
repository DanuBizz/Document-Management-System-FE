import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { environment } from '../../../environments/environment';
import { DocumentVersionsResponseInterface } from '../../admin-view/type/document-versions-response.interface';
import { DocumentRequestInterface } from '../../admin-view/type/document-request.interface';
import { PaginationConfigService } from './pagination-config.service';

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

  it('should return documents with associated versions with pagination query', () => {
    const dummyDocuments: DocumentVersionsResponseInterface[] = [
      {
        id: 1,
        documentName: 'Document 1',
        filePath: '/path/to/document1',
        timestamp: new Date(),
        categoryNames: ['Category 1'],
        isRead: true,
        isLatest: true,
        isVisible: true,
        oldVersions: [],
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
        oldVersions: [],
      },
    ];
    const dummyTotalElements = '2';
    const paginationConfigService = new PaginationConfigService();

    const queryParams = {
      pageNumber: paginationConfigService.getInitialPageIndex(),
      pageSize: paginationConfigService.getInitialPageSize(),
      sort: paginationConfigService.getInitialSort(),
      search: '',
    };

    service.fetchDocumentsWithAssociatedVersionsWithQuery(queryParams).subscribe(response => {
      expect(response.documents.length).toBe(2);
      expect(response.documents).toEqual(dummyDocuments);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl +
        '/latest-with-associated-versions' +
        `?page=${queryParams.pageNumber}&size=${queryParams.pageSize}&sort=${queryParams.sort}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyDocuments, totalElements: dummyTotalElements });
  });

  xit('should create a new document version', () => {
    /*
    const newDocumentVersion: DocumentRequestInterface = {
      file: new File(['dummy content'], 'dummy-file.txt'),
      name: 'Dummy Document',
      categoryIds: [1, 2],
      timestamp: new Date(),
    };

    service.createDocVersion(newDocumentVersion).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush();
    */
  });

  it('should update the visibility of a document', () => {
    const documentId = 1;
    const dummyResponse = { message: 'Erfolgreich geändert' };

    service.updateDocumentVisibility(documentId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl + `/${documentId}/toggle-visibility`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse);
  });
});
