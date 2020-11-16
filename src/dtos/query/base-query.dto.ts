import { QueryParameters } from "../query.params";
import { SortOrder } from "../../utils/enums/sort-oder.enum";
export class BaseQueryDTO {
    sortBy?: any;
    sortOrder?: SortOrder;
    pg?: number;
    rpp?: number;
    /**
     * 
     * @param queryDTO 
     */
    constructor(queryDTO: any) {
        if (queryDTO) {
            this.pg = queryDTO!.pg ? queryDTO!.pg : 1;
            this.rpp = queryDTO!.rpp;
            this.sortBy = queryDTO!.sortBy;
            this.sortOrder = queryDTO!.sortOrder;
        }
    }
    /**
     * get  query parameters object 
     * @param modelClassName 
     */

    getQueryParameters(modelClassName: any): QueryParameters {
        console.info(`getQueryParameters::${modelClassName}`)
        let query = new QueryParameters(modelClassName);
        // get key condition
        let keyConditionObject = this.getKeyCondition();
        if (keyConditionObject) {
            query.keyCondition = keyConditionObject;
            query.query = true;
        }
        // build filter object data
        let filterObject = this.getFilterObject();
        if (filterObject.filter && filterObject.filter.conditions.length > 0) {
            query.option.filter = filterObject.filter;
        }
        // sorting the data
        if (this.sortOrder && SortOrder[this.sortOrder] as SortOrder === SortOrder.DESCENDING) {
            query.option.scanIndexForward = false;
        }
        else {
            query.option.scanIndexForward = true;
        }
        return query;
    }
    /**
     * Check if the query contains the PK then return true
     */
    conatinPKAndSortKey(): boolean {
        return false;
    }
    /**
     * Build and get Model object for the querydto 
     */
    getModelObject(): any {
        throw new Error("Method not implemented.");
    }
    /**
     * Build and get filter object
     */
    getFilterObject(): any {
        throw new Error("Method not implemented.");
    }
    /**
     * Build and get Key conditions
     */
    getKeyCondition(): any {
        throw new Error("Method not implemented.");
    }
    setBooleanValue(value: string, key: string, query: Object) {
        if (value) {
            if (value == "true") {
                query[key] = true;
            }
            else if (value == "false") {
                query[key] = true;
            }
        }
    }
}

