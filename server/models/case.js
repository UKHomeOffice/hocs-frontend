const create = (action, data, callback) => {
    console.log(`ACTION => "${action}" DATA=> ${JSON.stringify(data)}`);
    callback(null, {caseId: 1234});
};

module.exports = {
    create
};