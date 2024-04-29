import { DocumentManagementComponent } from './document-management.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { DocumentResponseInterface } from '../../type/document-response.interface';

describe('CategoryManagementComponent', () => {
  let component: DocumentManagementComponent;
  let fixture: ComponentFixture<DocumentManagementComponent>;
  let store: MockStore;
  const initialState = {
    document: {
      isLoading: false,
      error: null,
      data: [
        {
          id: 10,
          name: 'test',
          filePath: 'asdf',
          categoryIds: [1, 2, 3],
          read: false,
          visible: true,
        },
      ],
    },
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
    expect(title.nativeElement.textContent).toContain('Dokument Management');
  });

  it('should render document data rows correctly', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].nativeElement.textContent).toContain('test');
  });

  it('should call createNewDocument() when FAB button is clicked', () => {
    spyOn(component, 'createNewDocument');
    const fabButton = fixture.debugElement.query(By.css('app-fab-button'));
    fabButton.triggerEventHandler('click', null);
    expect(component.createNewDocument).toHaveBeenCalled();
  });

  it('should disable createNewVersion()-Button if no document is selected', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-new-version-button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should disable open-in-Browser()-Button if no document is selected', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#test-open-browser-button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should render loading-bar', () => {
    store.setState({
      ...initialState,
      document: {
        ...initialState.document,
        isLoading: true,
      },
    });
    fixture.detectChanges();
    const loadingBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(loadingBar).toBeTruthy();
  });

  it('should toggle document selection', () => {
    const dummyDocument: DocumentResponseInterface = {
      id: 1,
      name: 'Test Document',
      filePath: '/path/to/document',
      categoryIds: [1],
      read: false,
      visible: true,
    };

    expect(component.selection.isSelected(dummyDocument)).toBeFalse();

    component.onDocumentToggled(dummyDocument);
    expect(component.selection.isSelected(dummyDocument)).toBeTrue();

    component.onDocumentToggled(dummyDocument);
    expect(component.selection.isSelected(dummyDocument)).toBeFalse();
  });
});
