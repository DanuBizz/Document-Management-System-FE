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
  reducer: createReducer(
    initialState,
    on(authActions.login, state => ({
      ...state,
      isSubmitting: true,
      validationErrors: null,
    })),

    on(authActions.loginSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentUser: action.currentUser,
    })),
    on(authActions.loginFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: action.errors,
    })),

    on(authActions.getCurrentUser, state => ({
      ...state,
      isLoading: true,
    })),

    on(authActions.getCurrentUserSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentUser: action.currentUser,
    })),
    on(authActions.getCurrentUserFailure, state => ({
      ...state,
      isLoading: false,
      currentUser: null,
    })),

    on(routerNavigationAction, state => ({
      ...state,
      validationErrors: null,
    }))
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
