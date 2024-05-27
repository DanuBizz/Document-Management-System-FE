import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotPermittedComponent } from './page-not-permitted.component';

describe('PageNotPermittedComponent', () => {
  let component: PageNotPermittedComponent;
  let fixture: ComponentFixture<PageNotPermittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotPermittedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotPermittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
