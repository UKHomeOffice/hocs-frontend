const config = require('./config.json');

const fetchSearchFieldsForCaseTypes = (caseTypes = []) => {
    return caseTypes
        .map(type => config[type] ?? [])
        .reduce((allFields, caseTypeFields) => {
            caseTypeFields.forEach(caseTypeField => {
                if (!allFields.some(field => field.name === caseTypeField.name &&
                        field.component === caseTypeField.component)) {
                    allFields.push(caseTypeField);
                }
            });

            return allFields;
        }, []);
};

module.exports = {
    fetchSearchFieldsForCaseTypes
};
