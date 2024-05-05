import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaginationQueryParamsInterface } from '../type/pagination-query-params.interface';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { UserResponseInterface } from '../../admin-view/type/user-response.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + '/users';

  const dummyUsers: UserResponseInterface[] = [
    { id: 1, username: 'User 1', email: 'test@example.com', isAdmin: true },
    { id: 2, username: 'User 2', email: 'test@example.com', isAdmin: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all users from the API', () => {
    const queryParamRetrieveAll: string = '?page=0&size=1000';

    service.fetchAllUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(baseUrl + queryParamRetrieveAll);
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyUsers });
  });

  it('should return users with pagination query from the api', () => {
    const dummyTotalElements = '2';
    const dummyPaginationQuery: PaginationQueryParamsInterface = { pageNumber: '0', pageSize: '20' };

    service.fetchUsersWitQuery({ queryParams: dummyPaginationQuery }).subscribe(response => {
      expect(response.users.length).toBe(2);
      expect(response.users).toEqual(dummyUsers);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl + `?page=${dummyPaginationQuery.pageNumber}&size=${dummyPaginationQuery.pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyUsers, totalElements: dummyTotalElements });
  });
});
