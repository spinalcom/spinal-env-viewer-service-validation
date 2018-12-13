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
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";

import * as constants from "./constants";

export default {
  constants,

  /**
   * Creates a validation context with a given name and 2 states.
   * @param {String} name Name of the Context
   * @throws {Error} When name is undefined or empty
   * @returns {Promise<String>} Id of the created SpinalContext
   */
  async createContext(name) {
    if (name === undefined || name === "") {
      throw Error(name + ": Invalid name");
    }

    const context = await SpinalGraphService.addContext(name, constants.CONTEXT_TYPE);
    const contextId = context.getId().get();
    const valid = SpinalGraphService.createNode({
      name: constants.VALID_NODE_NAME,
      type: constants.STATE_TYPE
    });
    const invalid = SpinalGraphService.createNode({
      name: constants.INVALID_NODE_NAME,
      type: constants.STATE_TYPE
    });

    await Promise.all([
      SpinalGraphService.addChildInContext(contextId, valid, contextId, constants.STATE_RELATION),
      SpinalGraphService.addChildInContext(contextId, invalid, contextId, constants.STATE_RELATION)
    ]);

    return contextId;
  },

  /**
   * Fills the valid and invalid states with BIMObjects.
   * @param {String} contextId Id of the validation context
   * @param {Array<dbId>} valid Array of valid dbIds
   * @param {Array<dbId>} invalid Array of invalid dbIds
   * @returns {Promise<>} An empty promise
   */
  async createRecord(contextId, newValid, newInvalid) {
    //TODO: use getChildrenInContext (not in graph service yet)
    const children = await SpinalGraphService.getChildren(contextId, constants.STATE_RELATION);
    const oldValid = children[0];
    const oldInvalid = children[1];
    const promises = [];

    const cmpBIMObjectDbId = (bim, dbId) => bim.info.dbId === dbId;
    const cmpDbIdBIMObject = (dbId, bim) => bim.info.dbId === dbId;

    const validToDel = _.differenceWith(newValid, oldValid, cmpDbIdBIMObject);
    const validToAdd = _.differenceWith(oldValid, newValid, cmpBIMObjectDbId);
    const invalidToDel = _.differenceWith(newinvalid, oldInvalid, cmpDbIdBIMObject);
    const invalidToAdd = _.differenceWith(oldInvalid, newinvalid, cmpBIMObjectDbId);

    for (let toAdd of validToAdd) {
      SpinalGraphService.addChildInContext(contextId);
    }

    for (let toDel of validToDel) {
      //TODO: Create BIMObjectService.removeBIMObject
      // promises.push(SpinalGraphService.removeChild(contextId, toDel.id.get()));
    }
  }
};
