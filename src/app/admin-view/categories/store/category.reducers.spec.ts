import { categoryReducer, initialState } from './category.reducers';
import { categoryActions } from './category.actions';

describe('CategoryReducers', () => {
  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = categoryReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: false,
      data: [],
    };

    expect(state).toEqual(newState);
  });

  it('get all categories', () => {
    const action = categoryActions.getAllCategories();
    const state = categoryReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: true,
      data: [],
    };

    expect(state).toEqual(newState);
  });

  it('get all categories success', () => {
    const action = categoryActions.getAllCategoriesSuccess({
      category: [
        {
          id: 10,
          name: 'test',
        },
      ],
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: false,
      data: [
        {
          id: 10,
          name: 'test',
        },
      ],
    };

    expect(state).toEqual(newState);
  });

  it('get all categories failure', () => {
    const action = categoryActions.getAllCategoriesFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      error: { ['error500']: ['Server error'] },
      isLoading: false,
      data: [],
    };

    expect(state).toEqual(newState);
  });
});
