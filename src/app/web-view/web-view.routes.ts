import { Route } from '@angular/router';
import { WebViewComponent } from './component/web-view/web-view.component';

export const WEB_VIEW_ROUTES: Route[] = [
  {
    path: '',
    title: 'Web View',
    component: WebViewComponent,
  },
];
