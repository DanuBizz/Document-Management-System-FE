import {BackendErrorsInterface} from "./backend-erros.interface";
import {DocCategoryResponseInterface} from "./doc-category-response.interface";

export interface DocCategoryStateInterface {
    isLoading: boolean;
    error: BackendErrorsInterface | null;
    data: DocCategoryResponseInterface[];
}
