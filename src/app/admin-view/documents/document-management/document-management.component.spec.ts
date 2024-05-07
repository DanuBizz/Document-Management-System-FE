import { DocumentManagementComponent } from './document-management.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { DocumentVersionsResponseInterface } from '../../type/document-versions-response.interface';

describe('DocumentManagementComponent', () => {
  let component: DocumentManagementComponent;
  let fixture: ComponentFixture<DocumentManagementComponent>;
  let store: MockStore;
  const initialState = {
    'document-admin': {
      isSubmitting: false,
      isLoading: false,
      error: null,
      data: [
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
      ],
      totalElements: '0',
      pageSizeOptions: [3, 5, 10, 25],
      pagination: {
        pageNumber: '0',
        pageSize: '5',
        sort: '',
      },
    },
  };

  const dummyDocument: DocumentVersionsResponseInterface = {
    id: 1,
    documentName: 'Document 1',
    filePath: '/path/to/document1',
    timestamp: new Date(),
    categoryNames: ['Category 1'],
    isRead: true,
    isLatest: true,
    isVisible: true,
    oldVersions: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentManagementComponent],
      providers: [provideMockStore({ initialState }), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentManagementComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toEqual('Dokument Management');
  });

  it('should render document data rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].nativeElement.textContent).toContain('Document');
  });

  it('should call createNewDocument() when FAB button is clicked', () => {
    spyOn(component, 'createNewDocument');
    const fabButton = fixture.debugElement.query(By.css('app-fab-button'));
    fabButton.triggerEventHandler('click', null);
    expect(component.createNewDocument).toHaveBeenCalled();
  });

  it('should disable createNewDocument()-Button if a document is selected', () => {
    component.onToggleSelectDocument(dummyDocument);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-new-document-button')).nativeElement;
    expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should disable createNewVersion()-Button if no document is selected', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-new-version-button')).nativeElement;
    expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should disable open-in-Browser()-Button if no document is selected', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-open-browser-button')).nativeElement;
    expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should disable changeVisibility()-Button if no document is selected', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-change-visibility-status')).nativeElement;
    expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should render loading-bar', () => {
    store.setState({
      ...initialState,
      'document-admin': {
        ...initialState['document-admin'],
        isLoading: true,
      },
    });
    fixture.detectChanges();
    const loadingBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(loadingBar).toBeTruthy();
  });

  it('should toggle document selection', () => {
    expect(component.selection.isSelected(dummyDocument)).toBeFalse();

    component.onToggleSelectDocument(dummyDocument);
    expect(component.selection.isSelected(dummyDocument)).toBeTrue();

    component.onToggleSelectDocument(dummyDocument);
    expect(component.selection.isSelected(dummyDocument)).toBeFalse();
  });
});
