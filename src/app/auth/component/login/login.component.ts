import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard, MatCardHeader } from '@angular/material/card';
import {LoginRequestInterface} from "../../type/login-request.interface";
import {authActions} from "../../store/auth.actions";
import {Store} from "@ngrx/store";
import {combineLatest} from "rxjs";
import {selectIsSubmitting, selectValidationErrors} from "../../store/auth.reducers";
import {
  BackendErrorMessagesComponent
} from "../../../shared/component/backend-error-messages/backend-error-messages.component";

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
  loginForm: FormGroup;

  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors)
  })

  constructor(private fb: FormBuilder, private store: Store,) {
    this.loginForm = this.fb.group({
      email: ['karl.franz.bertl.sayajin@kamehameha.at', [Validators.required]],
      password: ['karl.franz.bertl.sayajin123456789', [Validators.required]],
    });
  }

  onSubmit() {
    const request: LoginRequestInterface = {
      user: this.loginForm.getRawValue(),
    }

    this.store.dispatch(authActions.login({request}))
  }
}
