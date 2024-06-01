import { Routes } from '@angular/router';
import { DocumentsOverviewComponent } from './documents/documents-overview/documents-overview.component';
import { ConfirmNewDocumentsComponent } from './documents/confirm-new-documents/confirm-new-documents.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'confirm-new-documents',
    pathMatch: 'full',
  },
  {
    path: 'confirm-new-documents',
    title: 'CONFIRM NEW DOCUMENTS',
    component: ConfirmNewDocumentsComponent,
  },
  {
    path: 'documents-overview',
    title: 'DOCUMENTS OVERVIEW',
    component: DocumentsOverviewComponent,
  },
];
