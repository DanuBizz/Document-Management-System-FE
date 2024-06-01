import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewDocumentsComponent } from './confirm-new-documents.component';

describe('ConfirmNewDocumentsComponent', () => {
  let component: ConfirmNewDocumentsComponent;
  let fixture: ComponentFixture<ConfirmNewDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmNewDocumentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmNewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
