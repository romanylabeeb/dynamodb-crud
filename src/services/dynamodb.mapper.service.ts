import { DataMapper, QueryIterator, QueryPaginator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { Helper } from '../utils';
import { SortOrder } from '../utils/enums/sort-oder.enum';
import { QueryParameters } from '../dtos/query.params';

export class DynamodDBMapperService {
    private region = process.env.REGION || '';
    private mapper = new DataMapper({
        client: new DynamoDB({ region: this.region }), // the SDK client used to execute operations
        tableNamePrefix: process.env.TABLE_PREFIX || '' // optionally, you can provide a table prefix to keep your dev and prod tables separate
    });

    constructor() {

    }
    /**
     * Get Item By the PK
     * @param itemInfo 
     */

    public async getItem(itemInfo: any): Promise<any> {
        try {
            return this.mapper.get(itemInfo)
        }
        catch (err) {
            console.error("Item not found")
            return await null;
        }
    }
    /**
     * Add new Item
     * @param toSave 
     */
    public async put(toSave: any): Promise<any> {
        return this.mapper.put(toSave);
    }
    /**
     * Update Item
     * @param item 
     */
    public async update(item: any): Promise<any> {
        return await this.mapper.update(item);
    }
    /**
     * Query 
     * @param queryParams 
     */
    public async query(queryParams: QueryParameters): Promise<any> {
        console.info("Query::queryParams:", JSON.stringify(queryParams))
        const iterator = this.mapper.query(
            queryParams.className,
            queryParams.keyCondition,
            queryParams.option
        );
        return await this.getresult(iterator);
    }
    /**
     *  Query with pagination
     * @param queryParams 
     * @param pageSize 
     * @param pageNumber 
     * @param sortBy 
     * @param sortOrder 
     */
    public async queryWithPagination(queryParams: QueryParameters, pageSize, pageNumber, sortBy: any, sortOrder: any): Promise<any> {
        const paginator = this.mapper.query(
            queryParams.className,
            queryParams.keyCondition,
            queryParams.option
        ).pages();
        return await this.getPagedata(paginator, pageSize, pageNumber, sortBy, sortOrder);
    }
    /**
     * query Count
     * @param queryParams 
     */
    public async queryCount(queryParams: QueryParameters): Promise<any> {
        console.info("queryCount::", JSON.stringify(queryParams));
        let iterator = await this.mapper.query(
            queryParams.className,
            queryParams.keyCondition,
            queryParams.option
        );
        console.info("iterator:", JSON.stringify(iterator));
        return this.getCount(iterator);
    }
    /**
     * Scan operation
     * @param scanParams 
     */
    public async scan(scanParams: QueryParameters): Promise<any> {
        console.info("Scan::scanParams:", JSON.stringify(scanParams))
        const iterator = await this.mapper.scan(
            scanParams.className,
            scanParams.option
        );
        return await this.getresult(iterator);

    }
    /**
     * Scan operation with pagination
     * @param scanParams 
     * @param pageSize 
     * @param pageNumber 
     * @param sortBy 
     * @param sortOrder 
     */
    public async scanWithPagination(scanParams: QueryParameters, pageSize, pageNumber, sortBy: any, sortOrder: any): Promise<any> {
        console.info("scanWithPagination::", JSON.stringify(scanParams))
        const paginator = this.mapper.scan(
            scanParams.className,
            scanParams.option
        ).pages();
        return await this.getPagedata(paginator, pageSize, pageNumber, sortBy, sortOrder);
    }
    /**
     * Scan count
     * @param scanParams 
     */
    public async scanCount(scanParams: QueryParameters): Promise<any> {
        console.info("scanCount::", JSON.stringify(scanParams))
        let iterator = await this.mapper.scan(
            scanParams.className,
            scanParams.option
        );
        console.info("scanCount iterator=", JSON.stringify(iterator))
        return this.getCount(iterator);
    }
    /**
     * Delete Item
     * @param item 
     */
    public async delete(item: any): Promise<any> {
        return this.mapper.delete(item);
    }

    private async getPagedata(paginator: QueryPaginator<StringToAnyObjectMap>, pageSize: any, pageNumber: any, sortBy, sortOrder: SortOrder): Promise<any> {
        let itemList: any = [];
        let totalNumber = pageSize * pageNumber;
        for await (const page of paginator) {
            page.forEach(item => {
                itemList.push(item);
            });

            if (!sortBy && (paginator.count >= totalNumber)) {
                console.info("break paginator");
                break;
            }
        }
        if (sortBy) {
            itemList.sort((objectA, objectB) => {
                return Helper.compareObjects(objectA, objectB, sortBy, sortOrder);
            })
        }
        if (itemList.length >= totalNumber) {
            itemList = itemList.slice(totalNumber - pageSize, totalNumber);
            console.info("itemList:", itemList);
        }
        else {
            itemList = itemList.slice(totalNumber - pageSize, itemList.length);
            console.info("itemList:", itemList);
        }
        return {
            Items: itemList
        };
    }

    private async getresult(iterator: QueryIterator<StringToAnyObjectMap>): Promise<any> {
        let result: any = [];
        for await (const record of iterator) {
            console.info("record:", record, "count", iterator.count, "scannedCount", iterator.scannedCount);
            record.forEach(value => {
                result.push(value);
            });
        }
        return result;
    }
    private async getCount(iterator: QueryIterator<StringToAnyObjectMap>): Promise<number> {
        let result: any = 0;
        for await (const record of iterator) {
            console.info("record:", record, "count", iterator.count, "scannedCount", iterator.scannedCount);
            result = iterator.count;
        }
        return result;
    }
}