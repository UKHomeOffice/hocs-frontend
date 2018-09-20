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

const mockRender = jest.fn();
jest.mock('../../layout/html', () => {
    return {
        render: (options) => {
            mockRender(options);
            return 'RENDERED';
        }
    };
});

jest.mock('react', () => {
    return {
        createElement: (component, options) => {
            const { context } = options;
            if (context)
                context.status = 200;
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
    locals: { form: {} },
    status: jest.fn()
};

const next = jest.fn();

describe('Render middleware', () => {

    it('should render and set rendered on the response object', () => {
        renderMiddleware(req, res, next);
        expect(mockRender).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.rendered).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

});