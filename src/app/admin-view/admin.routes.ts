import { Routes } from '@angular/router';
import { CategoryManagementComponent } from './components/categories/category-management/category-management.component';
import { DocumentManagementComponent } from './components/documents/document-management/document-management.component';
import { UsersGroupsManagementComponent } from './components/users/user-group-management/users-groups-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'document',
    pathMatch: 'full',
  },
  {
    path: 'document',
    title: 'Document Management',
    component: DocumentManagementComponent,
  },
  {
    path: 'category',
    title: 'Category Management',
    component: CategoryManagementComponent,
  },
  {
    path: 'user',
    title: 'User Management',
    component: UsersGroupsManagementComponent,
  },
];
