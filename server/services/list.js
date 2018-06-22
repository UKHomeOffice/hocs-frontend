const User = require('../models/user');

const lists = {
    'case_type': ({user}) => {
        // TODO: add call to external service
        const list = [
            {
                "requiredRole": "DCU",
                "label": "DCU Ministerial",
                "value": "DCU_MINISTERIAL"
            },
            {
                "requiredRole": "UKVI",
                "label": "UKVI MREF",
                "value": "UKVI_MREF"
            },
            {
                "requiredRole": "FOI",
                "label": "FOI Complaint",
                "value": "FOI_COMPLAINT"
            }
        ];
        return list.filter(listItem => User.hasRole(user, listItem.requiredRole));
    }
};

const getList = (field, options) => {
    try {
        return lists[field.toLowerCase()].call(this, options);
    } catch (e) {
        throw new Error(`Unable to get list for ${field}: ${e}`);
    }
};

module.exports = {
    getList
};