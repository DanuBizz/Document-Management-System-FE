import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersGroupsManagementComponent } from './users-groups-management.component';

describe('UserManagementComponent', () => {
  let component: UsersGroupsManagementComponent;
  let fixture: ComponentFixture<UsersGroupsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersGroupsManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersGroupsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
