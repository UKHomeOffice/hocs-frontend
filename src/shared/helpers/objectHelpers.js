/**
 * @param object a object with a single value
 * @returns {boolean} array with index 0 being the name and index 1 being the value
 */
const getObjectNameValue = (object) => {
    if (object &&
        Object.keys(object).length >= 1 &&
        Object.getPrototypeOf(object) === Object.prototype) {
        return Object.entries(object)[0];
    }
    return ['',''];
};

export {
    getObjectNameValue
};
