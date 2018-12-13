import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
/**
 * Creates a validation context with a given name and 2 states.
 * @param {string} name Name of the Context
 * @throws {Error} When name is undefined or empty
 * @returns {Promise<SpinalContext>} The created SpinalContext
 */
declare function createValidationContext(name: string): Promise<SpinalContext>;
/**
 * Creates a state containing the given dbIds.
 * @param {SpinalContext} context Context in which to create the state
 * @param {string} name Name of the state
 * @param {Array<Number>} dbIds Array of dbIds to use to create the BIMObjects
 * @returns {SpinalNode} Created state
 */
declare function createState(context: SpinalContext, name: string, dbIds: Array<Number>): SpinalNode;
/**
 * Creates a record from two arrays of valid and invalid dbIds.
 * @param {SpinalContext} context Context in which to create the record
 * @param {Array<Number>} validDbIds Valid dbIds to put in the valid state
 * @param {Array<Number>} invalidDbIds Invalid dbIds to put in the invalid state
 * @returns {SpinalNode} Created record
 */
declare function createRecord(context: SpinalContext, validDbIds: Array<Number>, invalidDbIds: Array<Number>): SpinalNode;
export { createValidationContext, createState, createRecord };
