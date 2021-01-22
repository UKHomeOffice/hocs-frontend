const extractWorkstackTypeColumns = (suffix) => (workstackTypeColumns, request) => {
    let caseType = request.caseType;

    // The casetypes are generated based on the order the checkboxes are selected in the UI,
    // therefore we need to sort them to avoid huge combinations of orders
    if (caseType.indexOf(',') !== -1) {
        caseType = sortCaseTypesAlphabetically(request.caseType);
    }

    let workstackColumns = workstackTypeColumns.find(
        item => item.workstackType === `${caseType}_${suffix}`
    );

    if (workstackColumns === undefined) {
        workstackColumns = workstackTypeColumns.find(
            item => item.workstackType === 'DEFAULT'
        );
    }
    return workstackColumns;
};

const sortCaseTypesAlphabetically = (caseType) => {
    const alphabeticalCaseTypeArray = caseType.split(',').sort((a, b) => a.localeCompare(b));
    return alphabeticalCaseTypeArray.join(',');
};

module.exports = {
    extractWorkstackTypeColumns,
    sortCaseTypesAlphabetically
};
