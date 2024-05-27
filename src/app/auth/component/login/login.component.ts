import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { LoginRequestInterface } from '../../type/login-request.interface';
import { authActions } from '../../store/auth.actions';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { selectIsSubmitting, selectValidationErrors } from '../../store/auth.reducers';
import { BackendErrorMessagesComponent } from '../../../shared/component/backend-error-messages/backend-error-messages.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCard,
    MatCardHeader,
    BackendErrorMessagesComponent,
  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  title = 'Anmelden';

  passwordFieldType: string = 'password';

  // FormGroup for handling login form
  loginForm: FormGroup;

  // Observable to combine the isSubmitting and backendErrors from the store
  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors),
  });

  /**
   * @param fb FormBuilder instance for creating form controls
   * @param store Store instance for dispatching actions and accessing store data
   */
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authService: AuthService
  ) {
    // Initialize loginForm with default values and validators
    this.loginForm = this.fb.group({
      username: ['Admin', [Validators.required]],
      password: ['password', [Validators.required]],
    });
  }

  /**
   * onSubmit method to handle form submission
   * Constructs LoginRequestInterface and dispatches login action
   */
  onSubmit() {
    // Constructing LoginRequestInterface
    const request: LoginRequestInterface = {
      user: this.loginForm.getRawValue(),
    };
    this.authService.updateLoggedInStatus(true);
    // Dispatching login action with the request
    this.store.dispatch(authActions.login({ request }));
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
