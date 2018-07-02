import html from '../html';

html.use({
    'js': {
        'main': 'js/main.js',
        'first': 'js/first.js',
        'second': 'js/second.js',
        'myBundle': 'js/myBundle.js'
    },
    'css': {
        'first': 'styles/first.css'
    }
});

describe('HTML module', () => {
    it('should return the default html when no additional configuration is passed', () => {
        const configuration = {};
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should include the server rendered markup when passed', () => {
        const configuration = {
            markup: '<--- REACT APPLICATION --->'
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should not contain the react bundle js when clientside is set to false', () => {
        const configuration = {
            clientSide: false
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should include additional CSS and JS when passed', () => {
        const configuration = {
            js: ['first', 'second'],
            css: ['first']
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should include the appropriate react application bundle when passed', () => {
        const configuration = {
            react: 'myBundle'
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should default to proposition header when no title is passed', () => {
        const configuration = {
            propositionHeader: 'Proposition Header',
            title: null
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should include the correct asset path when passed', () => {
        const configuration = {
            assetPath: 'some/public/folder/that/contains/my/assets'
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
    it('should include application props in the head when passed', () => {
        const configuration = {
            props: {
                first: 'value',
                second: 'value'
            }
        };
        const markup = html.render(configuration);
        expect(markup).toBeDefined();
        expect(markup).toMatchSnapshot();
    });
});