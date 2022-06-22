/**
 * Check to see if field component is of type.
 * @param field the field to check
 * @param type the type to compare the component against
 * @returns {boolean} whether the field should be kept (true)
 */
const isFieldComponentOfType = ({ component }, type) => component === type;

module.exports = {
    isFieldComponentOfType,
};
