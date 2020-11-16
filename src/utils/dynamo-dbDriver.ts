import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import AWS = require('aws-sdk');
export class DynamoDbDriver {



    public async query(params: any): Promise<any> {
        return await this.ddb.query(params).promise();
    }

    public async scan(params: any): Promise<any> {
        return await this.ddb.scan(params).promise();
    }

    private ddb: DocumentClient;
    constructor() {
        let options: any = {
            convertEmptyValues: true,
            maxRetries: 9,
            httpOptions: {
                timeout: 5000
            }
        };
        this.ddb = new AWS.DynamoDB.DocumentClient(options)
    }
    get client() {
        return this.ddb;
    }

    public async getItembyPartitionKeyAndSortKey(tableName: string, keyName: string, sortKeyName: string, keyValue: string, sortKeyValue: any): Promise<any> {
        let params = {
            TableName: tableName,
            Key: {}
        }
        params.Key[`${keyName}`] = keyValue;
        params.Key[`${sortKeyName}`] = sortKeyValue;
        console.info("getItem::", params);
        return await this.ddb.get(params).promise();
    }
    public async getItemsByIndexName(tableName: string, indexName: string, indexKey: string, indexValue: string): Promise<any> {
        let ExpressionAttributeValues = {};
        ExpressionAttributeValues[`:${indexKey}`] = indexValue;
        let params = {
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: `${indexKey} = :${indexKey}`,
            ExpressionAttributeValues: ExpressionAttributeValues
        }
        console.info("getItemsByIndexName::", params);
        return await this.ddb.query(params).promise();
    }
    async deleteByIdAndSortKey(tableName: string, keyName: string, sortKeyName: string, keyValue: string, sortKeyValue: string): Promise<any> {
        let params = {
            TableName: tableName,
            Key: {}
        }
        params.Key[`${keyName}`] = keyValue;
        params.Key[`${sortKeyName}`] = sortKeyValue;
        console.info("deleteByIdAndSortKey::", params);
        return await this.ddb.delete(params).promise();
    }
    async deleteById(tableName: string, keyName: string, keyValue: string): Promise<any> {
        let params = {
            TableName: tableName,
            Key: {}
        }
        params.Key[`${keyName}`] = keyValue;
        console.info("deleteById::", params);
        return await this.ddb.delete(params).promise();
    }
    /**
     * add/update item
     */
    public async putItem(tableName: string, item: object): Promise<any> {
        let params = {
            Item: item,
            TableName: tableName
        };
        console.info("putItem:params:", params)
        return await this.ddb.put(params).promise();
    }
}