import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from './auth/store/auth.reducers';
import { CurrentUserInterface } from './shared/type/current-user.interface';
import { authActions } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    MatDivider,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  //  Holds information about the current user's session, controlling login/logout button visibility.
  currentUser: CurrentUserInterface | null | undefined;

  // Determines if the current user has administrator privileges, influencing navigation bar display.
  isAdmin?: boolean;

  // Tracks the current URL path, used to hide specific navigation bar elements.
  currentUrl?: string;

  constructor(
    private router: Router,
    private store: Store
  ) {}

  /**
   * Initializes the component by selecting the current user from the store.
   * If a user is found, sets the current user and determines if the user is an admin.
   */
  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe()
      .subscribe((user: CurrentUserInterface | null | undefined) => {
        this.currentUser = user;
        if (user) {
          this.isAdmin = user.isAdmin;
        }
      });

    this.store.dispatch(authActions.getCurrentUser());
  }

  logout(): void {
    this.store.dispatch(authActions.logout());
  }

  /**
   * Checks the current URL to determine if the nav-elements should be hidden
   */
  checkUrl(): boolean {
    this.currentUrl = this.router.url;

    const isLoginPage = this.currentUrl === '/login';
    const isHomePage = this.currentUrl === '/';
    const isPageNotFound = this.currentUrl.endsWith('page-not-found');
    const isPageNotPermitted = this.currentUrl.endsWith('page-not-permitted');
    const isConfirmNewDocuments = this.currentUrl.endsWith('confirm-new-documents');

    return isLoginPage || isHomePage || isPageNotFound || isPageNotPermitted || isConfirmNewDocuments;
  }
}
