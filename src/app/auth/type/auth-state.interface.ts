import {CurrentUserInterface} from "../../shared/type/current-user.interface";
import {BackendErrorsInterface} from "../../shared/type/backend-erros.interface";

export interface AuthStateInterface {
    isSubmitting: boolean
    currentUser: CurrentUserInterface | null | undefined
    isLoading: boolean
    validationErrors: BackendErrorsInterface | null
}
