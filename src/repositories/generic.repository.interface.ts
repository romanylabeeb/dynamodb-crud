import { BaseQueryDTO } from "../dtos/query/base-query.dto";

export interface IGenericRepository {
    modelName:any;
    repoName:any;
    getItems(queryDTO: BaseQueryDTO): Promise<any>;
    putItem(item: any): Promise<void>;
    updateItem(item: any): Promise<any>;
    delete(item: any): Promise<void>;
    getItem(item: any): Promise<any>;
    getItemByPk(pkKey,pkValue: any): Promise<any>;
    getCount(queryDTO: BaseQueryDTO): Promise<number>;
}