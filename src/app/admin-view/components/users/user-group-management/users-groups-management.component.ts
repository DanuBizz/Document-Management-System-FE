import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { GroupManagementComponent } from './group-management/group-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    RouterLink,
    GroupManagementComponent,
    UserManagementComponent,
    MatIcon,
    MatTabLabel,
    MatTooltip,
  ],
  templateUrl: './users-groups-management.component.html',
  styleUrl: './users-groups-management.component.scss',
})
export class UsersGroupsManagementComponent {
  selectedTabIndex = signal(0);
}
