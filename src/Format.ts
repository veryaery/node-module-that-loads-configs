export type FormatReturnObject = {
    content: any,
    defaulted: boolean
};

/**
 * Transforms ConfigFile data after being read and content before being written
 * @example
 * import {
 *      Format,
 *      FormatReturnObject
 * } from "@aery/mlc";
 * 
 * class MyFormat extends Format {
 * 
 *      read(data: Buffer, default_content?: string, default_options?: null): FormatReturnObject {
 *          // Do something with data
 *          if (data) {
 *              return {
 *                  content: data.toString(),
 *                  defaulted: false
 *              };
 *          } else {
 *              if (default_content) {
 *                  return {
 *                      content: default_content,
 *                      defaulted: true
 *                  };
 *              } else {
 *                  return {
 *                      content: data,
 *                      defaulted: false
 *                  };
 *              }
 *          }
 *      }
 * 
 *      write(content: string): string {
 *          // Do something with content
 *          return content;
 *      }
 * 
 * }
 * 
 * @abstract
 * @class
 */
export abstract class Format {

    abstract read(data: Buffer, default_content?: any, default_options?: any): FormatReturnObject | Promise<FormatReturnObject>

    abstract write(content: any): string | Promise<string>

}

/**
 * @typedef FormatReturnObject
 * @property {} content - Transformed data
 * @property { boolean } defaulted - If content was defaulted in any way
 */

/**
 * Transforms data before it's used
 * 
 * @memberOf Format
 * @instance
 * @abstract
 * @function read
 * @param { Buffer } data
 * @param default_content 
 * @param default_options
 * @returns { FormatReturnObject | Promise<FormatReturnObject> }
 */

/**
 * Transforms content before it's written
 * 
 * @memberOf Format
 * @instance
 * @abstract
 * @function write
 * @param content
 * @returns { string | Promise<string> } - Transformed content in the form of a string
 */