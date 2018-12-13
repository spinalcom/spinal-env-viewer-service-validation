declare const _default: {
    /**
     * Creates a validation context with a given name and 2 states.
     * @param {string} name Name of the Context
     * @throws {Error} When name is undefined or empty
     * @returns {Promise<SpinalContext>} The created SpinalContext
     */
    createContext(name: string): Promise<any>;
};
export default _default;
