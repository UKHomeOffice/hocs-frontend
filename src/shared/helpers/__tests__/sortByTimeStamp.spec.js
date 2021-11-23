import sortByTimeStamp from '../sortByTimeStamp';

describe('when the sortByTimeStamp method is called', () => {
    const item1 = { timeStamp: '2019-12-06T11:02:38.582695' };
    const item2 = { timeStamp: '2019-12-06T11:03:38.582695' };

    it('will return 1 when A is less than B', () => {
        const result = sortByTimeStamp(item1, item2);
        expect(result).toBe(1);
    });
    it('will return -1 when A is less than B', () => {
        const result = sortByTimeStamp(item2, item1);
        expect(result).toBe(-1);
    });
    it('will return 0 when A is equal to B', () => {
        const result = sortByTimeStamp(item1, item1);
        expect(result).toBe(0);
    });
});
