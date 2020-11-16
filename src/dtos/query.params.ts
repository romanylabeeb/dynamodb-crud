import { QueryOptions } from "@aws/dynamodb-data-mapper"

export class QueryParameters {
    className?: any;
    keyCondition?: any;
    option: QueryOptions={};
    query?: boolean = false;
    constructor(modelClassName) {
        this.className = modelClassName;
    }
}