const cron = require('node-cron');
const listType = require('./types');
const { STATIC_DATA_REFRESH_SCHEDULE } = require('../../config').forContext('server');

const scheduleListRefresh = (list, flush) => {
    cron.schedule(STATIC_DATA_REFRESH_SCHEDULE, () => {
        Object.entries(list)
            .filter(([_, { type = listType.DYNAMIC }]) => {
                return type === listType.STATIC;
            })
            .map(async ([listId, _]) => {
                await flush(listId);
            });
    });
};

module.exports = scheduleListRefresh;
