import { Routes } from '@angular/router';
import { PageNotPermittedComponent } from './page-not-permitted.component';

export const PAGE_NOT_PERMITTED_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'page-not-permitted',
    pathMatch: 'full',
  },
  {
    path: 'page-not-permitted',
    title: 'PAGE NOT PERMITTED',
    component: PageNotPermittedComponent,
  },
];
