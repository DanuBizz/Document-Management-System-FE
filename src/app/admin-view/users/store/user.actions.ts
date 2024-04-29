import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {BackendErrorsInterface} from "../../../shared/type/backend-erros.interface";
import {UserResponseInterface} from "../../type/user-response.interface";


export const userActions = createActionGroup({
  source: 'user',
  events: {
    'get all users': emptyProps(),
    'get all users success': props<{ user: UserResponseInterface[] }>(),
    'get all users failure': props<{ error: BackendErrorsInterface }>(),
  },
});
