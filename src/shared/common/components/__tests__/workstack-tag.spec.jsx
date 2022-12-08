import Tags from '../workstack-tag.jsx';

describe('Workstack Tag component', () => {
    it('should return no tags when passed none', () => {
        const props = {
            row: {
                stageType: 'TEST_CASE',
                tag: []
            }
        };
        expect(Tags(props).length).toBe(0);
    });

    it('should return a tag when passed', () => {
        const props = {
            row: {
                stageType: 'TEST_CASE',
                tag: ['HS']
            }
        };
        expect(Tags(props.row.tag)).toBeDefined();
    });
});
