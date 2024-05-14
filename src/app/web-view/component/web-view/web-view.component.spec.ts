import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { WebViewComponent } from './web-view.component';
import { HttpClientModule } from '@angular/common/http';

describe('WebViewComponent', () => {
  let component: WebViewComponent;
  let fixture: ComponentFixture<WebViewComponent>;
  const initialState = { fileData: null }; // Setzen Sie den Anfangszustand Ihrer Store-Eigenschaften hier

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebViewComponent, HttpClientModule],
      providers: [
        {
          provide: Store,
          useValue: provideMockStore({ initialState }),
        },
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(WebViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load test file', () => {
    const testFileUrl = 'assets/testfiles/testfile.pdf';
    const sanitizedUrl = TestBed.inject(DomSanitizer).bypassSecurityTrustResourceUrl(testFileUrl);
    expect(component.fileUrl).toEqual(sanitizedUrl);
  });
});
