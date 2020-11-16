import { beginsWith, between, contains, equals, ConditionExpression, inList } from "@aws/dynamodb-expressions";

export class QueryBuilder {
    public static getConditionExperssion(conditions): ConditionExpression {
        let andExpression: ConditionExpression = {
            type: 'And',
            conditions: conditions
        };
        console.info("andExpression::", andExpression)
        return andExpression;
    }
    public static defineEqualCondition(key, value, conditionList): void {
        if (value != undefined && value != null) {
            let equalsExpressionPredicate = equals(value);
            // combine with a subject to create a valid condition expression
            const equalsExpression: ConditionExpression = {
                ...equalsExpressionPredicate,
                subject: key
            };
            console.info("equalsExpression::", equalsExpression)
            conditionList.push(equalsExpression);
        }
    }

    public static defineBetweenCondition(key, startvalue, endValue, conditionList): void {
        if (startvalue && endValue) {
            let betweenExpressionPredicate = between(startvalue, endValue);
            // combine with a subject to create a valid condition expression
            const betweenExpression: ConditionExpression = {
                ...betweenExpressionPredicate,
                subject: key
            };
            console.info("defineBetweenCondition::", betweenExpression)
            conditionList.push(betweenExpression);
        }
    }
    public static defineBeginWithCondition(key, value, conditionList): void {
        if (value) {
            let beginWithExpressionPredicate = beginsWith(value);
            // combine with a subject to create a valid condition expression
            const beginWithExpression: ConditionExpression = {
                ...beginWithExpressionPredicate,
                subject: key
            };
            console.info("defineBeginWithCondition::", beginWithExpression)
            conditionList.push(beginWithExpression);
        }
    }
    public static defineContainsCondition(key, value, conditionList): void {
        if (value) {
            let containsExpressionPredicate = contains(value);
            // combine with a subject to create a valid condition expression
            const containsExpression: ConditionExpression = {
                ...containsExpressionPredicate,
                subject: key
            };
            console.info("defineContainsCondition::", containsExpression)
            conditionList.push(containsExpression);
        }
    }
    public static defineInListCondition(key, value: any, conditionList): void {
        if (value) {
            let inListExpressionPredicate = inList(value);
            // combine with a subject to create a valid condition expression
            const inListExpression: ConditionExpression = {
                ...inListExpressionPredicate,
                subject: key
            };
            console.info("defineInListCondition::", inListExpression)
            conditionList.push(inListExpression);
        }
    }
}
