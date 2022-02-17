const titleCase = require('../titleCaseHelper');

describe('titleCaseHelper.js', () => {

    it('should change \'hello\' to \'Hello\'', () => {

        const original = 'hello';
        const expectedOutput = 'Hello';

        const output = titleCase(original);

        expect(output).toEqual(expectedOutput);
    });

    it('should change \'this is a title\' to \'This Is A Title\'', () => {

        const original = 'this is a title';
        const expectedOutput = 'This Is A Title';

        const output = titleCase(original);

        expect(output).toEqual(expectedOutput);
    });
});