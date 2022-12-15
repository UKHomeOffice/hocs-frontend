const config = require('./tagConfig.json');

const fetchTagType = (name) => {
    return config[name];
};

module.exports = {
    fetchTagType
};
