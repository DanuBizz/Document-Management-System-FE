import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import { BackendErrorsInterface } from '../../../shared/type/backend-erros.interface';
import { BackendErrorMessagesComponent } from '../../../shared/component/backend-error-messages/backend-error-messages.component';
import { authActions } from '../../store/auth.actions';
import { LoginRequestInterface } from '../../type/login-request.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  const initialState = {
    auth: {
      isSubmitting: false,
      isLoading: false,
      currentUser: undefined,
      validationErrors: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideMockStore({ initialState }), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Anmelden');
  });

  it('should display backend error messages if present', () => {
    const testErrors: BackendErrorsInterface = {
      error: ['server error', 'test error'],
    };
    store.setState({
      ...initialState,
      auth: { ...initialState.auth, validationErrors: testErrors },
    });
    fixture.detectChanges();

    const backendErrorMessages = fixture.debugElement.query(By.directive(BackendErrorMessagesComponent));
    expect(backendErrorMessages).toBeTruthy();

    const errorComponent = backendErrorMessages.componentInstance as BackendErrorMessagesComponent;
    expect(errorComponent.backendErrors).toEqual(testErrors);
  });

  it('should display required field error for email if email is empty', () => {
    const emailInputElement = fixture.debugElement.query(By.css('input[type=email]')).nativeElement;
    emailInputElement.value = '';

    emailInputElement.dispatchEvent(new Event('input'));
    emailInputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const emailError = fixture.debugElement.query(By.css('mat-error'));
    expect(emailError.nativeElement.textContent).toContain('Email ist erforderlich');
  });

  it('should display required field error for password if password is empty', () => {
    const passwordInputElement = fixture.debugElement.query(By.css('input[type=password]')).nativeElement;
    passwordInputElement.value = '';

    passwordInputElement.dispatchEvent(new Event('input'));
    passwordInputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const passwordError = fixture.debugElement.query(By.css('mat-error'));
    expect(passwordError.nativeElement.textContent).toContain('Passwort ist erforderlich');
  });

  it('should disable login-button if form is invalid', () => {
    component.loginForm.controls['email'].setValue('karl.franz.bertl.sayajin@kamehameha.at');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    expect(loginButton.disabled).toBeTruthy();
  });

  it('should enable login button if form is valid', () => {
    component.loginForm.controls['email'].setValue('karl.franz.bertl.sayajin@kamehameha.at');
    component.loginForm.controls['password'].setValue('karl.franz.bertl.sayajin123456789');

    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    expect(loginButton.disabled).toBeFalsy();
  });

  it('should dispatch login action with correct data on form submit', () => {
    const formData = {
      username: 'user',
      password: 'password',
    };
    component.loginForm.setValue(formData);
    component.onSubmit();

    const expectedAction = authActions.login({ request: { user: formData } as LoginRequestInterface });
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
