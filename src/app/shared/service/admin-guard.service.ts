import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { selectCurrentUser } from '../../auth/store/auth.reducers';
import { CurrentUserInterface } from '../type/current-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkIfAdmin();
  }

  private checkIfAdmin(): Observable<boolean | UrlTree> {
    return this.store.select(selectCurrentUser).pipe(
      map((user: CurrentUserInterface | null | undefined) => {
        if (user) {
          if (user.isAdmin) {
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
