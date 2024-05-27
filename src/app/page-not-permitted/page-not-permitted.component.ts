import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-permitted',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-not-permitted.component.html',
  styleUrl: './page-not-permitted.component.scss',
})
export class PageNotPermittedComponent {}
