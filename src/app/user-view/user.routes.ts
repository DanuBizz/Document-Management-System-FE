import { Routes } from '@angular/router';
import { DocumentsOverviewComponent } from './documents/documents-overview/documents-overview.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'documents-overview',
    pathMatch: 'full',
  },
  {
    path: 'documents-overview',
    title: 'Documents Overview',
    component: DocumentsOverviewComponent,
  },
];
