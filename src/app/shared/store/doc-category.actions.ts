import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {DocCategoryResponseInterface} from "../type/doc-category-response.interface";
import {BackendErrorsInterface} from "../type/backend-erros.interface";

export const docCategoryActions = createActionGroup({
    source: 'doc-category',
    events: {
        'get all document categories': emptyProps(),
        'get all document categories success': props<{ docCategory: DocCategoryResponseInterface[] }>(),
        'get all document categories failure': props<{ error: BackendErrorsInterface }>(),
    },
});
