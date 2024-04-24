import {authReducer, initialState} from "./auth.reducers";
import {authActions} from "./auth.actions";
import {LoginRequestInterface} from "../type/login-request.interface";
import {CurrentUserInterface} from "../../shared/type/current-user.interface";
import {BackendErrorsInterface} from "../../shared/type/backend-erros.interface";
import {routerNavigationAction} from "@ngrx/router-store";


describe('AuthReducers', () => {


    it('returns a default state', () => {
        const action = {type: 'UNKNOWN'};
        const state = authReducer(initialState, action);
        const newState = {
            isSubmitting: false,
            isLoading: false,
            currentUser: undefined,
            validationErrors: null,
        }

        expect(state).toEqual(newState);
    })


    it('should login', () => {
        const request: LoginRequestInterface = {
            user: {
                email: 'karl.franz.bertl.sayajin@kamehameha.at',
                password: 'karl.franz.bertl.sayajin123456789'
            }
        }

        const action = authActions.login({request});
        const state = authReducer(initialState, action);
        const newState = {
            isSubmitting: true,
            isLoading: false,
            currentUser: undefined,
            validationErrors: null,
        }

        expect(state).toEqual(newState);
    })

    it('should login success', () => {
        const currentUser: CurrentUserInterface = {
            email: 'karl.franz.bertl.sayajin@kamehameha.at',
            token: 'karl.franz.bertl.sayajin123456789',
            username: 'karli',
            bio: null,
            image: null
        }

        const action = authActions.loginSuccess({currentUser});
        const state = authReducer(initialState, action);
        const newState = {
            isSubmitting: false,
            isLoading: false,
            currentUser: currentUser,
            validationErrors: null,
        }

        expect(state).toEqual(newState);
    })

    it('should login failure', () => {
        const errors: BackendErrorsInterface = {
            'error': ['server error', 'test error']
        }

        const action = authActions.loginFailure({errors});
        const state = authReducer(initialState, action);
        const newState = {
            isSubmitting: false,
            isLoading: false,
            currentUser: undefined,
            validationErrors: errors,
        }

        expect(state).toEqual(newState);
    })

    it('should getCurrentUser', () => {

        const action = authActions.getCurrentUser();
        const state = authReducer(initialState, action);
        const newState = {
            ...initialState,
            isLoading: true,
        }

        expect(state).toEqual(newState);
    })

    it('should get current user success', () => {
        const currentUser: CurrentUserInterface = {
            email: 'karl.franz.bertl.sayajin@kamehameha.at',
            token: 'karl.franz.bertl.sayajin123456789',
            username: 'karli',
            bio: null,
            image: null
        }

        const action = authActions.getCurrentUserSuccess({currentUser});
        const state = authReducer(initialState, action);
        const newState = {
            ...initialState,
            isLoading: false,
            currentUser: action.currentUser
        }

        expect(state).toEqual(newState);
    })

    it('should get current user failure', () => {
        const action = authActions.getCurrentUserFailure();
        const state = authReducer(initialState, action);
        const newState = {
            ...initialState,
            isLoading: false,
            currentUser: null
        }

        expect(state).toEqual(newState);
    })

    it('should delete errors when routing', () => {
        const action = routerNavigationAction;
        const state = authReducer(initialState, action);
        const newState = {
            ...initialState,
            validationErrors: null
        }

        expect(state).toEqual(newState);
    })


})
