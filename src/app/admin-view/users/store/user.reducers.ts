import {UserStateInterface} from "../../type/user-state.interface";
import { createFeature, createReducer, on } from '@ngrx/store';
import {userActions} from "./user.actions";

// Initial state for the categories feature
export const initialState: UserStateInterface = {
  isLoading: false,
  error: null,
  data: [],
  totalElements: '0',
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
  selectIsLoading,
  selectError,
  selectData: selectUserData,
  selectTotalElements: selectTotalUserElements
} = userFeature;
