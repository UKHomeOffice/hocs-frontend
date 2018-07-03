const User = require('../models/user');
const {DOCUMENT_WHITELIST} = require('../config').forContext('server');

const lists = {
    'case_type': ({user}) => {
        // TODO: add call to workflow service
        const list = [
            {
                "requiredRole": "DCU",
                "label": "DCU Ministerial",
                "value": "MIN"
            },
            {
                "requiredRole": "UKVI",
                "label": "UKVI MREF",
                "value": "MREF"
            },
            {
                "requiredRole": "FOI",
                "label": "FOI Complaint",
                "value": "COM"
            }
        ];
        return list.filter(listItem => User.hasRole(user, listItem.requiredRole));
    },
    'document_extension_whitelist': () => {
        return DOCUMENT_WHITELIST.split(',');
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