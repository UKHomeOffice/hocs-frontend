import { renderMiddleware } from '../render';

jest.mock('../../config.js', () => {
    return {
        forContext: context => {
            switch (context) {
            case 'render':
                return {};
            case 'case':
                return {};
            }
        }
    };
});

jest.mock('../../layout/html', () => {
    return {
        render: () => null
    };
});

jest.mock('react', () => {
    return {
        createElement: (component, options) => {
            const { context } = options;
            if (context) {
                context.url = 'ERROR_URL';
            }
            return;
        }
    };
});

jest.mock('react-dom/server', () => {
    return {
        renderToString: () => null
    };
});

jest.mock('react-router-dom', () => {
    return {
        StaticRouter: () => null
    };
});

const req = {};

const res = {
    redirect: jest.fn()
};

const next = jest.fn();

describe('Render middleware', () => {

    it('should redirect if url passed back from react StaticRouter context', () => {
        renderMiddleware(req, res, next);
        expect(res.redirect).toHaveBeenCalled();
    });

});