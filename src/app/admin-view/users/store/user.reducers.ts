import { UserStateInterface } from '../../type/user-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userActions } from './user.actions';

// Initial state for the feature
export const initialState: UserStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  data: [],
  totalElements: '0',
  queryParams: {
    pageNumber: '0',
    pageSize: '5',
  },
};

export const userFeature = createFeature({
  name: 'user',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(userActions.getAllUsers, state => ({
      ...state,
      isLoading: true,
    })),
    on(userActions.getAllUsersSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      data: action.user,
    })),
    on(userActions.getAllUsersFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    on(userActions.getUsersWithQuery, (state, action) => ({
      ...state,
      isLoading: true,
      queryParams: action.queryParams,
    })),
    on(userActions.getUsersWithQuerySuccess, (state, { users, totalElements }) => ({
      ...state,
      isLoading: false,
      data: users,
      totalElements: totalElements,
    })),
    on(userActions.getUsersWithQueryFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    on(userActions.changeUserRole, state => ({
      ...state,
      isSubmitting: true,
    })),
    on(userActions.changeUserRoleSuccess, state => ({
      ...state,
      isSubmitting: false,
    })),
    on(userActions.changeUserRoleFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      error: action.error,
    }))

    // Handling router navigated action
    /*
    on(routerNavigatedAction, () => (initialState))
    */
  ),
});

// Extracting necessary values from the feature
export const {
  name: userFeatureKey,
  reducer: userReducer,
  selectIsSubmitting: selectUserIsSubmitting,
  selectIsLoading: selectUserIsLoading,
  selectError: selectUserError,
  selectData: selectUserData,
  selectTotalElements: selectTotalUserElements,
  selectQueryParams,
} = userFeature;
