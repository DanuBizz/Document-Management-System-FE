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
import { AuthService } from './auth/service/auth.service';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from './auth/store/auth.reducers';
import { CurrentUserInterface } from './shared/type/current-user.interface';

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
  currentUser: CurrentUserInterface | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe()
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
        }
      });
  }
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.currentUser = undefined;
      this.router.navigate(['/login']);
    });
  }
}
