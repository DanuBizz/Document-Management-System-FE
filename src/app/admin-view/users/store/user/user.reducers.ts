import { UserStateInterface } from '../../../type/user-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { userActions } from './user.actions';
import { PaginationConfigService } from '../../../../shared/service/pagination-config.service';

const paginationConfigService = new PaginationConfigService();

// Initial state for the feature
export const initialState: UserStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  allData: [],
  tableData: [],
  totalElements: '0',
  queryParams: {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
    search: '',
  },
  areLoaded: false,
};

export const userFeature = createFeature({
  name: 'user',
  // Reducer functions for the feature
  reducer: createReducer<UserStateInterface>(
    initialState,
    on(
      userActions.getAllUsers,
      (state): UserStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      userActions.getAllUsersSuccess,
      (state, action): UserStateInterface => ({
        ...state,
        isLoading: false,
        allData: action.user,
      })
    ),
    on(
      userActions.getAllUsersFailure,
      (state, action): UserStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),
    // GET WITH QUERY
    on(
      userActions.getUsersWithQuery,
      (state, action): UserStateInterface => ({
        ...state,
        isLoading: true,
        queryParams: action.queryParams,
      })
    ),
    on(
      userActions.getUsersWithQuerySuccess,
      (state, { users, totalElements }): UserStateInterface => ({
        ...state,
        isLoading: false,
        tableData: users,
        totalElements: totalElements,
        areLoaded: true,
      })
    ),
    on(
      userActions.getUsersWithQueryFailure,
      (state, action): UserStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
        areLoaded: false,
      })
    ),

    // CHANGE ROLE

    on(
      userActions.changeUserRole,
      (state): UserStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      userActions.changeUserRoleSuccess,
      (state): UserStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      userActions.changeUserRoleFailure,
      (state, action): UserStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    ),

    // CHANGE USER GROUP

    on(
      userActions.changeUserGroups,
      (state): UserStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      userActions.changeUserGroupsSuccess,
      (state): UserStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      userActions.changeUserGroupsFailure,
      (state, action): UserStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    )

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
  selectTableData: selectUserTableData,
  selectAllData: selectUserAllData,
  selectTotalElements: selectTotalUserElements,
  selectQueryParams: selectUserQueryParams,
  selectAreLoaded: selectUserAreLoaded,
} = userFeature;
