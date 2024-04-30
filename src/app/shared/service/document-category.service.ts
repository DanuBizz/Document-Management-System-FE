import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DocCategoryResponseInterface} from "../type/doc-category-response.interface";

@Injectable({
    providedIn: 'root',
})
export class DocumentCategoryService {
    private baseUrl: string = environment.apiUrl + '/documents';

    constructor(private http: HttpClient) {}

    /**
     * Retrieves all document categories from the backend.
     * @returns An observable of an array of response objects.
     */
    fetchAllDocumentCategories(): Observable<DocCategoryResponseInterface[]> {
        const queryParamRetrieveAll: string = '?page=0&size=1000';
        const fullUrl = this.baseUrl + queryParamRetrieveAll;
        return this.http.get<{ content: DocCategoryResponseInterface[] }>(fullUrl)
            .pipe(map(response => response.content));
    }

}
