import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { CategoryResponseInterface } from '../../admin-view/type/category-response.interface';
import { environment } from '../../../environments/environment';
import { CategoryRequestInterface } from '../../admin-view/type/category-request.interface';
import { PaginationConfigService } from './pagination-config.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/categories';

  const dummyCategories: CategoryResponseInterface[] = [
    { id: 1, name: 'Category 1', groupNames: ['group1'], groupIds: [1] },
    { id: 2, name: 'Category 2', groupNames: ['group1', 'group2'], groupIds: [1, 2] },
  ];

  const paginationConfigService = new PaginationConfigService();

  const queryParams = {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
    search: '',
  };

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

    service.fetchCategoriesWithQuery(queryParams).subscribe(response => {
      expect(response.categories.length).toBe(2);
      expect(response.categories).toEqual(dummyCategories);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl + `?page=${queryParams.pageNumber}&size=${queryParams.pageSize}&sort=${queryParams.sort}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyCategories, totalElements: dummyTotalElements });
  });

  it('should create a new category', () => {
    const dummyNewCategory: CategoryRequestInterface = { name: 'New Category', groupNames: ['group1', 'group2'] };

    service.createCategory(dummyNewCategory).subscribe(response => {
      expect(response).toBe(200);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
