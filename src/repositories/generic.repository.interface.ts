import { BaseQueryDTO } from "../dtos/query/base-query.dto";

export interface IGenericRepository {
    modelName:any;
    repoName:any;
    getList(queryDTO: BaseQueryDTO): Promise<any>;
    putRecord(item: any): Promise<void>;
    updateRecord(item: any): Promise<any>;
    delete(item: any): Promise<void>;
    getItem(item: any): Promise<any>;
    getItemByPk(pkKey,pkValue: any): Promise<any>;
    getCount(queryDTO: BaseQueryDTO): Promise<number>;
}