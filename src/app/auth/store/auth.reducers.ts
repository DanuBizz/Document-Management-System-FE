import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthStateInterface } from '../type/auth-state.interface';
import { authActions } from './auth.actions';
import { routerNavigationAction } from '@ngrx/router-store';

export const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  currentUser: undefined,
  validationErrors: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer<AuthStateInterface>(
    initialState,
    on(
      authActions.login,
      (state): AuthStateInterface => ({
        ...state,
        isSubmitting: true,
        validationErrors: null,
      })
    ),

    on(
      authActions.loginSuccess,
      (state, action): AuthStateInterface => ({
        ...state,
        isSubmitting: false,
        currentUser: action.currentUser,
      })
    ),
    on(
      authActions.loginFailure,
      (state, action): AuthStateInterface => ({
        ...state,
        isSubmitting: false,
        validationErrors: action.errors,
      })
    ),

    on(
      authActions.getCurrentUser,
      (state): AuthStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),

    on(
      authActions.getCurrentUserSuccess,
      (state, action): AuthStateInterface => ({
        ...state,
        isLoading: false,
        currentUser: action.currentUser,
      })
    ),
    on(
      authActions.getCurrentUserFailure,
      (state): AuthStateInterface => ({
        ...state,
        isLoading: false,
        currentUser: null,
      })
    ),
    on(
      authActions.logout,
      (): AuthStateInterface => ({
        ...initialState,
      })
    ),
    on(
      authActions.logoutSuccess,
      (): AuthStateInterface => ({
        ...initialState,
      })
    ),
    on(
      authActions.logoutSuccess,
      (): AuthStateInterface => ({
        ...initialState,
      })
    ),

    on(
      routerNavigationAction,
      (state): AuthStateInterface => ({
        ...state,
        validationErrors: null,
      })
    )
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentUser,
  selectValidationErrors,
} = authFeature;
