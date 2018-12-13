/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  SpinalGraphService,
  SpinalContext,
  SpinalNode,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";

import * as constants from "./constants";

/**
 * Creates a validation context with a given name and 2 states.
 * @param {string} name Name of the Context
 * @throws {Error} When name is undefined or empty
 * @returns {Promise<SpinalContext>} The created SpinalContext
 */
async function createValidationContext(name: string): Promise<SpinalContext> {
  if (name === undefined || name === "") {
    throw Error(name + ": Invalid name");
  }

  const context: SpinalContext = await SpinalGraphService.addContext(
    name,
    constants.VALIDATION_CONTEXT_TYPE
  );

  return context;
}

/**
 * Creates a state containing the given dbIds.
 * @param {SpinalContext} context Context in which to create the state
 * @param {string} name Name of the state
 * @param {Array<Number>} dbIds Array of dbIds to use to create the BIMObjects
 * @returns {SpinalNode} Created state
 */
async function createState(
  context: SpinalContext,
  name: string,
  dbIds: Array<Number>
): SpinalNode {
  const state: SpinalNode = new SpinalNode(name, constants.STATE_TYPE);
  const promises: Array<Promise<SpinalNode>> = [];

  for (let dbId of dbIds) {
    promises.push(bimObjectService.addBIMObject(context, state, dbId));
  }

  await Promise.all(promises);
  return state;
}

/**
 * Creates a record from two arrays of valid and invalid dbIds.
 * @param {SpinalContext} context Context in which to create the record
 * @param {Array<Number>} validDbIds Valid dbIds to put in the valid state
 * @param {Array<Number>} invalidDbIds Invalid dbIds to put in the invalid state
 * @returns {SpinalNode} Created record
 */
async function createRecord(
  context: SpinalContext,
  validDbIds: Array<Number>,
  invalidDbIds: Array<Number>
): SpinalNode {
  const record: SpinalNode = new SpinalNode(
    "record - " + Date(),
    constants.RECORD_TYPE
  );

  await context.addChildInContext(record, constants.RECORD_RELATION);

  const [validState, invalidState] = await Promise.all([
    createState(context, constants.VALID_STATE_NAME, validDbIds),
    createState(context, constants.INVALID_STATE_NAME, invalidDbIds)
  ]);

  await Promise.all([
    record.addChildInContext(
      validState,
      constants.STATE_RELATION,
      SPINAL_RELATION_PTR_LST_TYPE,
      context
    ),
    record.addChildInContext(
      invalidState,
      constants.STATE_RELATION,
      SPINAL_RELATION_PTR_LST_TYPE,
      context
    )
  ]);

  return record;
}

export { createValidationContext, createState, createRecord };
