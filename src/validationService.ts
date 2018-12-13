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

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import * as constants from "./constants";

export default {
  async createContext(name: string): Promise<string> {
    if (name === undefined || name === "") {
      throw Error(name + ": Invalid name");
    }

    const context = await SpinalGraphService.addContext(
      name,
      constants.CONTEXT_TYPE
    );
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
      SpinalGraphService.addChildInContext(
        contextId,
        valid,
        contextId,
        constants.STATE_RELATION
      ),
      SpinalGraphService.addChildInContext(
        contextId,
        invalid,
        contextId,
        constants.STATE_RELATION
      )
    ]);

    return contextId;
  }
};
