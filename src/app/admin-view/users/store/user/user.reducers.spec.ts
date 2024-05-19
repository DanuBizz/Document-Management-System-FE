import { initialState, userReducer } from './user.reducers';
import { userActions } from './user.actions';
import { UserResponseInterface } from '../../../type/user-response.interface';
import { PaginationQueryParamsInterface } from '../../../../shared/type/pagination-query-params.interface';

describe('UserReducers', () => {
  const users: UserResponseInterface[] = [
    {
      id: 1,
      username: 'User 1',
      email: 'test@example.com',
      isAdmin: true,
    },
  ];

  const pagination: PaginationQueryParamsInterface = {
    pageNumber: '0',
    pageSize: '5',
    sort: '',
  };

  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = userReducer(initialState, action);
    const newState = { ...initialState };

    expect(state).toEqual(newState);
  });

  it('should get all users', () => {
    const action = userActions.getAllUsers();
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('should get all users success', () => {
    const action = userActions.getAllUsersSuccess({ user: users });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      allData: action.user,
    };

    expect(state).toEqual(newState);
  });

  it('should get all users failure', () => {
    const action = userActions.getAllUsersFailure({
      error: { ['error500']: ['Server error'] },
    });

    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });

  it('should change the state for get users with query', () => {
    const action = userActions.getUsersWithQuery({ pagination: pagination });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('should get users and totalElements when success', () => {
    const totalElements = '1';

    const action = userActions.getUsersWithQuerySuccess({ users: users, totalElements: totalElements });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      tableData: users,
      totalElements: totalElements,
    };

    expect(state).toEqual(newState);
  });

  it('should get users with query failure', () => {
    const action = userActions.getUsersWithQueryFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });

  it('should change user role', () => {
    const action = userActions.changeUserRole({ id: 1, isAdmin: true });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: true,
    };

    expect(state).toEqual(newState);
  });

  it('should change user role success', () => {
    const action = userActions.changeUserRoleSuccess({ message: 'test' });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
    };

    expect(state).toEqual(newState);
  });

  it('should change user role failure', () => {
    const error = { ['error500']: ['Server error'] };
    const action = userActions.changeUserRoleFailure({ error: error });
    const state = userReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
      error: error,
    };

    expect(state).toEqual(newState);
  });
});
