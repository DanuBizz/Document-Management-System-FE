import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagementComponent } from './category-management.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('CategoryManagementComponent', () => {
  let component: CategoryManagementComponent;
  let fixture: ComponentFixture<CategoryManagementComponent>;
  let store: MockStore;
  const initialState = {
    categories: {
      isSubmitting: false,
      isLoading: false,
      error: null,
      data: [{ id: 10, name: 'test', userNames: ['testuser1'] }],
      totalElements: '0',
      pageSizeOptions: ['5', '10', '25', '50'],
      pagination: {
        pageNumber: '0',
        pageSize: '5',
        sort: '',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryManagementComponent],
      providers: [provideMockStore({ initialState }), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryManagementComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Kategorie Management');
  });

  it('should render category data rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    expect(rows.length).toEqual(1);
    expect(rows[0].nativeElement.textContent).toContain('test');
  });

  it('should call createNewCategory() when FAB button is clicked', () => {
    spyOn(component, 'createNewCategory');
    const fabButton = fixture.debugElement.query(By.css('app-fab-button'));
    fabButton.triggerEventHandler('OnClick', null);
    expect(component.createNewCategory).toHaveBeenCalled();
  });

  it('should render loading-bar', () => {
    store.setState({
      ...initialState,
      categories: { ...initialState.categories, isLoading: true },
    });
    fixture.detectChanges();
    const loadingBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(loadingBar).toBeTruthy();
  });
});
