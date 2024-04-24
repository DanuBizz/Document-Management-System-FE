import { Route } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";

export const LOGIN_ROUTES: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
];
