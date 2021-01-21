const extractWorkstackTypeColumns = (suffix) => (workstackTypeColumns, request) => {
    let workstackColumns = workstackTypeColumns.find(
        item => item.workstackType === `${request.caseType}_${suffix}`
    );

    if (workstackColumns === undefined) {
        workstackColumns = workstackTypeColumns.find(
            item => item.workstackType === 'DEFAULT'
        );
    }
    return workstackColumns;
};

module.exports = {
    extractWorkstackTypeColumns
};
