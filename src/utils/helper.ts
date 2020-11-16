'use strict';

import { SortOrder } from "./enums/sort-oder.enum";

export class Helper {

    constructor() {
    }
/**
 * 
 * @param object1 
 * @param object2 
 * @param key 
 * @param sortOrder 
 */
    static compareObjects(object1, object2, key, sortOrder: SortOrder) {
        const keyValue1 = Helper.getKeyValue(object1, key);
        const keyValue2 = Helper.getKeyValue(object2, key);
        if (keyValue1 < keyValue2) {
            if (sortOrder == SortOrder.ASCENDING) {
                return -1
            }
            return 1;
        }
        if (keyValue1 > keyValue2) {
            if (sortOrder == SortOrder.ASCENDING) {
                return 1
            }
            return -1;
        }
        return 0
    }
    static getKeyValue(object, key) {
        if (object.hasOwnProperty(key)) {
            return object[key].toUpperCase();
        }
        return null;
    }
}