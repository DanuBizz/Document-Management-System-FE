import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementComponent } from './user-management.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let store: MockStore;
  const initialState = {
    user: {
      isSubmitting: false,
      isLoading: false,
      error: null,
      data: [
        {
          id: 1,
          username: 'test user 1',
          email: 'test@example.com',
          isAdmin: false,
        },
      ],
      totalElements: '1',
      queryParams: {
        pageNumber: '0',
        pageSize: '5',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [provideMockStore({ initialState }), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toEqual('User Management');
  });

  it('should render users data rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].nativeElement.textContent).toContain('test');
  });

  it('should render loading-bar', () => {
    store.setState({
      ...initialState,
      user: {
        ...initialState.user,
        isLoading: true,
      },
    });
    fixture.detectChanges();
    const loadingBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(loadingBar).toBeTruthy();
  });
});
