import { docCategoryReducer, initialState } from './doc-category.reducers';
import { docCategoryActions } from './doc-category.actions';
import { DocCategoryResponseInterface } from '../../type/doc-category-response.interface';

describe('DocCategoryReducers', () => {
  const docCategory: DocCategoryResponseInterface[] = [
    {
      id: 1,
      name: 'docCategory',
    },
  ];

  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = docCategoryReducer(initialState, action);
    const newState = {
      isLoading: false,
      error: null,
      data: [],
    };

    expect(state).toEqual(newState);
  });

  it('should get all document categories', () => {
    const action = docCategoryActions.getAllDocumentCategories();
    const state = docCategoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('should get all document categories success', () => {
    const action = docCategoryActions.getAllDocumentCategoriesSuccess({ docCategory: docCategory });
    const state = docCategoryReducer(initialState, action);
    const newState = {
      ...initialState,
      data: action.docCategory,
    };

    expect(state).toEqual(newState);
  });

  it('should get all document categories failure', () => {
    const action = docCategoryActions.getAllDocumentCategoriesFailure({
      error: { ['error500']: ['Server error'] },
    });

    const state = docCategoryReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });
});
