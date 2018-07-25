import processMiddleware from '../process';

const formSchema = {
    fields: [
        {
            component: 'text',
            validation: [
                'required'
            ],
            props: {
                name: 'text_field',
            }
        }
    ]
};

describe('Process middleware', () => {
    it('should process form data when passed', () => {
        const req = {
            body: {
                field: 'field value'
            },
            query: {},
            form: {
                schema: formSchema
            }
        };
        const res = {};

        processMiddleware(req, res, () => {
            expect(req.form).toBeDefined();
            expect(req.form.data).toBeDefined();
        });
    });
});