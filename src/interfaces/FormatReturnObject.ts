export interface FormatReturnObject {
    content: any,
    defaulted?: boolean
};

/**
 * Returned by a Format's read method
 * 
 * @interface FormatReturnObject
 */

/**
 * The transformed data in the form of content
 * 
 * @memberof FormatReturnObject
 * @instance
 * @name content
 */

/**
 * If the content was defaulted in any way
 * 
 * @memberof FormatReturnObject
 * @instance
 * @name defaulted
 * @type { ?boolean }
 */