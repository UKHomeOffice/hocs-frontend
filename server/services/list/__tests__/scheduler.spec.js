const FakeTimers = require('@sinonjs/fake-timers');
const listType = require('../types');
const scheduleListRefresh = require('../scheduler');

describe('node-cron', () => {
    const data = {
        TEST: {
            type: listType.STATIC,
        }
    };
    const mock = jest.fn()
        .mockImplementationOnce(async (listId) => flushedValue = listId);

    let flushedValue;
    let clock;

    beforeEach(() => {
        clock = FakeTimers.install({
            now: new Date(2021, 0, 1, 0, 13)
        });

        flushedValue = '';
    });

    afterEach(() => {
        clock.uninstall();
    });

    it('should flush for data in right format', () => {
        scheduleListRefresh(data, mock);

        clock.tick(180000);

        expect(flushedValue).toEqual('TEST');
    });

    it('should not flush with invalid data', () => {
        scheduleListRefresh({}, mock);

        clock.tick(180000);

        expect(flushedValue).toEqual('');
    });

});
