import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';
import { environment } from '../../../environments/environment';
import { CategoryRequestInterface } from '../../admin-view/type/category-request.interface';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/categories';

  const dummyCategories: CategoryResponseInterface[] = [
    { id: 1, name: 'Document 1', userIds: [1, 3] },
    { id: 2, name: 'Document 2', userIds: [2, 4, 6] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all categories from the API', () => {
    const queryParamRetrieveAll: string = '?page=0&size=1000';

    service.fetchAllCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(baseUrl + queryParamRetrieveAll);
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyCategories });
  });

  it('should return categories with pagination query from the api', () => {
    const dummyTotalElements = '2';
    const dummyPaginationQuery: PaginationQueryParamsInterface = { pageNumber: '0', pageSize: '20' };

    service.fetchCategoriesWithQuery({ queryParams: dummyPaginationQuery }).subscribe(response => {
      expect(response.categories.length).toBe(2);
      expect(response.categories).toEqual(dummyCategories);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl + `?page=${dummyPaginationQuery.pageNumber}&size=${dummyPaginationQuery.pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyCategories, totalElements: dummyTotalElements });
  });

  it('should create a new category', () => {
    const dummyNewCategory: CategoryRequestInterface = { name: 'New Category', userIds: [2, 3] };

    service.createCategory(dummyNewCategory).subscribe(response => {
      expect(response.message).toBe('Erfolgreich hochgeladen');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
