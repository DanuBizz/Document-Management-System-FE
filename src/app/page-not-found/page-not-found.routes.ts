import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';

export const PAGE_NOT_FOUND_ROUTES: Routes = [
  {
    path: '',
    title: 'PAGE NOT FOUND',
    component: PageNotFoundComponent,
  },
];
