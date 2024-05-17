import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { UserGroupManagementComponent } from './user-group-management/user-group-management.component';
import { UserRoleManagementComponent } from './user-role-management/user-role-management.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    RouterLink,
    UserGroupManagementComponent,
    UserRoleManagementComponent,
    MatIcon,
    MatTabLabel,
    MatTooltip,
    MatMiniFabButton,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  selectedTabIndex = signal(0);
}
