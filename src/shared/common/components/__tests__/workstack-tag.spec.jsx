import Tags from '../workstack-tag.jsx';

describe('Workstack Tag component', () => {
    it('should return default tags when passed empty tag', () => {
        const tags = {
            'tags': ['']
        };

        expect(Tags(tags).length).toBe(1);
    });

    it('should return empty tags when passed none', () => {
        const tags = {};

        expect(Tags(tags).length).toBe(0);
    });

    it('should return a tag when passed', () => {
        const tags = {
            'tags':
                ['TEST']
        };

        expect(Tags(tags).length).toBe(1);
    });
});
