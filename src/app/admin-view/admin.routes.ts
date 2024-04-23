import { Routes } from '@angular/router';
import { CategoryManagementComponent } from './categories/category-management/category-management.component';
import { DocumentManagementComponent } from './documents/document-management/document-management.component';

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
];
