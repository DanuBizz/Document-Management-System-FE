import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TestBed } from '@angular/core/testing';
import { DocCategoryResponseInterface } from '../type/doc-category-response.interface';
import { DocumentCategoryService } from './document-category.service';

describe('DocumentCategoryService', () => {
  let service: DocumentCategoryService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/documents';

  const dummyDocCategories: DocCategoryResponseInterface[] = [
    { id: 1, name: 'Document 1' },
    { id: 2, name: 'Document 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentCategoryService],
    });
    service = TestBed.inject(DocumentCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all document categories from the API', () => {
    const queryParamRetrieveAll: string = '?page=0&size=1000';

    service.fetchAllDocumentCategories().subscribe(docCategories => {
      expect(docCategories.length).toBe(2);
      expect(docCategories).toEqual(dummyDocCategories);
    });

    const req = httpMock.expectOne(baseUrl + queryParamRetrieveAll);
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyDocCategories });
  });
});
