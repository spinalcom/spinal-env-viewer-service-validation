"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constants = require("./constants");
exports.default = {
    /**
     * Creates a validation context with a given name and 2 states.
     * @param {string} name Name of the Context
     * @throws {Error} When name is undefined or empty
     * @returns {Promise<SpinalContext>} The created SpinalContext
     */
    createContext(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name === undefined || name === "") {
                throw Error(name + ": Invalid name");
            }
            const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(name, constants.CONTEXT_TYPE);
            const valid = new spinal_env_viewer_graph_service_1.SpinalNode(constants.VALID_NODE_NAME, constants.STATE_TYPE);
            const invalid = new spinal_env_viewer_graph_service_1.SpinalNode(constants.INVALID_NODE_NAME, constants.STATE_TYPE);
            yield Promise.all([
                context.addChildInContext(valid, constants.STATE_RELATION),
                context.addChildInContext(invalid, constants.STATE_RELATION)
            ]);
            return context;
        });
    }
};
