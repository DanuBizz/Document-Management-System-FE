import { createFeature, createReducer, on } from '@ngrx/store';
import { fileActions } from './file.actions';
import { FileStateInterface } from '../../type/file-state.interface';

export const initialState: FileStateInterface = {
  data: null,
  error: null,
  isLoading: false,
};

export const fileFeature = createFeature({
  name: 'file',
  reducer: createReducer(
    initialState,
    on(fileActions.getFile, state => ({
      ...state,
      isLoading: true,
    })),
    on(fileActions.getFileSuccess, (state, action) => ({
      ...state,
      data: action.fileUrl,
      isLoading: false,
    })),
    on(fileActions.getFileFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    }))
    /*
    on(routerNavigatedAction, () => initialState)
    */
  ),
});

export const {
  name: fileFeatureKey,
  reducer: fileReducer,
  selectIsLoading: selectFileIsLoading,
  selectError: selectFileError,
  selectData: selectFileData,
} = fileFeature;
