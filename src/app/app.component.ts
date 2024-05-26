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
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.authService.updateLoggedInStatus(false);
      this.router.navigate(['/login']);
    });
  }
}
