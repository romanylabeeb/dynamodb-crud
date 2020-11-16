import { DynamodDBMapperService } from "../services/dynamodb.mapper.service";
import { BaseQueryDTO, } from "../dtos/query/base-query.dto";
import { IGenericRepository } from "../repositories/generic.repository.interface";
import { QueryParameters } from "../dtos/query.params";

export class GenericRepository implements IGenericRepository {
    modelName: any = "";
    repoName: any = "";
    dynamodDBMapperService: DynamodDBMapperService;
    constructor(modelName, repoName) {
        this.dynamodDBMapperService = new DynamodDBMapperService();
        this.modelName = modelName;
        this.repoName = repoName;
        console.info("init GenericRepository")
    }
    /**
     * Get List with pagination 
     * using query if queryDTO contains the PK
     * using scan if queryDTO doesn't contain the PK
     * @param queryDTO 
     */
    async getList(queryDTO: BaseQueryDTO): Promise<any> {
        console.info(`${this.repoName}::getList`);
        try {
            let query: QueryParameters = queryDTO.getQueryParameters(this.modelName);
            let data: any = {}
            if (query.query) {
                data = await this.dynamodDBMapperService.queryWithPagination(query, queryDTO.rpp, queryDTO.pg, queryDTO.sortBy, queryDTO.sortOrder);
            } else {
                data = await this.dynamodDBMapperService.scanWithPagination(query, queryDTO.rpp, queryDTO.pg, queryDTO.sortBy, queryDTO.sortOrder);
            }
            console.info("data::", data);
            if (data.Items) {
                return data.Items;
            }
        }
        catch (err) {
            console.info(`${this.repoName}:getList::error::`, err);
            throw err;
        }
    }
    /**
     * Add new Item in DB
     * @param item 
     */

    async putRecord(item: any): Promise<void> {
        console.info(`${this.repoName}:putRecord`);
        try {
            await this.dynamodDBMapperService.put(item);
        }
        catch (err) {
            console.error("Error put item ::", err);
            throw err;
        }
    }
    /**
     * Update Item in DB
     * @param item 
     */
    async updateRecord(item: any): Promise<any> {
        //UPDATE item to DB
        console.info(`${this.repoName}:updateRecord`);
        return await this.dynamodDBMapperService.update(item);
    }
    /**
     * Delete Item 
     * @param item 
     */
    async delete(item: any): Promise<void> {
        return await this.dynamodDBMapperService.delete(item);
    }
    /**
     * Get item By the PK
     * @param item 
     */
    async getItem(item: any): Promise<any> {
        console.info(`${this.repoName}:getItem`);
        return await this.dynamodDBMapperService.getItem(item);
    }
    /**
     * 
     * @param pkKey 
     * @param pkValued 
     */
    async getItemByPk(pkKey: string, pkValued: any): Promise<any> {
        console.info(`${this.repoName}:getItemById`);
        let keyCondition = {};
        keyCondition[`${pkKey}`] = pkValued;
        let query: QueryParameters = {
            query: true,
            className: this.modelName,
            keyCondition: keyCondition,
            option: {}
        }
        const result = await this.dynamodDBMapperService.query(query);
        if (result.Items && result.Items.length > 0) {
            console.info(`${this.repoName}::getItemByPk:`, result.Items[0])
            return result.Items[0];
        }
        else {
            return null;
        }
    }
    /**
     *  Get Count Using the queryDTO
     * @param queryDTO 
     */
    async getCount(queryDTO: BaseQueryDTO): Promise<number> {
        try {
            let query: QueryParameters = queryDTO.getQueryParameters(this.modelName);
            let total: number = 0;
            if (query.query) {
                total = await this.dynamodDBMapperService.queryCount(query);
            } else {
                total = await this.dynamodDBMapperService.scanCount(query);
            }
            console.info("getCount::total::", total);
            return total;
        }
        catch (err) {
            console.info(`${this.repoName}:getCount:error::`, err)
            throw err;
        }
    }
}
