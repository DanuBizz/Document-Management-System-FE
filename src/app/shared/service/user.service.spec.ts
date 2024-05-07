import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { UserResponseInterface } from '../../admin-view/type/user-response.interface';
import { NewPaginationQueryParamsInterface } from '../type/new-pagination-query-params.interface';

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
    const pagination: NewPaginationQueryParamsInterface = {
      pageNumber: '0',
      pageSize: '5',
      sort: '',
    };

    service.fetchUsersWitQuery(pagination).subscribe(response => {
      expect(response.users.length).toBe(2);
      expect(response.users).toEqual(dummyUsers);
      expect(response.totalElements).toBe(dummyTotalElements);
    });

    const req = httpMock.expectOne(
      baseUrl + `?page=${pagination.pageNumber}&size=${pagination.pageSize}&sort=${pagination.sort}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: dummyUsers, totalElements: dummyTotalElements });
  });

  it('should update the isAdmin state of a user', () => {
    const userId = 1;
    const isAdmin = false;
    const dummyResponse = { message: 'Erfolgreich geändert' };

    service.updateUserRole(userId, isAdmin).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(baseUrl + `/${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyResponse);
  });
});
