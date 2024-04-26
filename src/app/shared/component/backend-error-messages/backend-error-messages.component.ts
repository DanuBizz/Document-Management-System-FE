import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BackendErrorsInterface } from '../../type/backend-erros.interface';

@Component({
  selector: 'app-backend-error-messages',
  templateUrl: './backend-error-messages.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class BackendErrorMessagesComponent implements OnInit {
  // Input property to receive backend errors
  @Input() backendErrors: BackendErrorsInterface = {};

  // Array to store error messages
  errorMessages: string[] = [];

  constructor() {}

  ngOnInit(): void {
    // Mapping backend errors to error messages array
    this.errorMessages = Object.keys(this.backendErrors).map((name: string) => {
      const messages = this.backendErrors[name].join(' '); // Joining error messages for each field
      return `${name} ${messages}`; // Combining field name with its error messages
    });
  }
}
