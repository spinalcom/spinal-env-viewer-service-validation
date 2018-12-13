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
const spinal_env_viewer_plugin_bimobjectservice_1 = require("spinal-env-viewer-plugin-bimobjectservice");
const constants = require("./constants");
/**
 * Creates a validation context with a given name and 2 states.
 * @param {string} name Name of the Context
 * @throws {Error} When name is undefined or empty
 * @returns {Promise<SpinalContext>} The created SpinalContext
 */
function createValidationContext(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (name === undefined || name === "") {
            throw Error(name + ": Invalid name");
        }
        const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(name, constants.VALIDATION_CONTEXT_TYPE);
        return context;
    });
}
exports.createValidationContext = createValidationContext;
/**
 * Creates a state containing the given dbIds.
 * @param {SpinalContext} context Context in which to create the state
 * @param {string} name Name of the state
 * @param {Array<Number>} dbIds Array of dbIds to use to create the BIMObjects
 * @returns {SpinalNode} Created state
 */
function createState(context, name, dbIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = new spinal_env_viewer_graph_service_1.SpinalNode(name, constants.STATE_TYPE);
        const promises = [];
        for (let dbId of dbIds) {
            promises.push(spinal_env_viewer_plugin_bimobjectservice_1.default.addBIMObject(context, state, dbId));
        }
        yield Promise.all(promises);
        return state;
    });
}
exports.createState = createState;
/**
 * Creates a record from two arrays of valid and invalid dbIds.
 * @param {SpinalContext} context Context in which to create the record
 * @param {Array<Number>} validDbIds Valid dbIds to put in the valid state
 * @param {Array<Number>} invalidDbIds Invalid dbIds to put in the invalid state
 * @returns {SpinalNode} Created record
 */
function createRecord(context, validDbIds, invalidDbIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = new spinal_env_viewer_graph_service_1.SpinalNode("record - " + Date(), constants.RECORD_TYPE);
        yield context.addChildInContext(record, constants.RECORD_RELATION);
        const [validState, invalidState] = yield Promise.all([
            createState(context, constants.VALID_STATE_NAME, validDbIds),
            createState(context, constants.INVALID_STATE_NAME, invalidDbIds)
        ]);
        yield Promise.all([
            record.addChildInContext(validState, constants.STATE_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE, context),
            record.addChildInContext(invalidState, constants.STATE_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE, context)
        ]);
        return record;
    });
}
exports.createRecord = createRecord;
