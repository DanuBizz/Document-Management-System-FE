import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../auth/store/auth.reducers';
import { CurrentUserInterface } from '../type/current-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkIfAuthenticatedUser();
  }

  private checkIfAuthenticatedUser(): Observable<boolean | UrlTree> {
    return this.store.select(selectCurrentUser).pipe(
      map((user: CurrentUserInterface | null | undefined) => {
        if (user) {
          if (!user.isAdmin) {
            return true;
          } else {
            return this.router.parseUrl('/forbidden');
          }
        } else {
          return this.router.parseUrl('/forbidden');
        }
      })
    );
  }
}
