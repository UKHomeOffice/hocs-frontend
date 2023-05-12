import React from 'react';
import { ApplicationProvider } from '../../../contexts/application.jsx';
import FormEmbeddedWrapped from '../../forms/form-embedded-wrapped.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Form embedded wrapped component', () => {

    const config = {
        page: {
            params: {
                caseId: '12345678-12345-12345-12345678'
            }
        }
    };

    const page = {
            params: {
                caseId: '12345678-12345-12345-12345678'
            }
        },
        schema = {
            props: {
                collapsable: {
                    hintText: 'Test'
                }
            },
            summary: [
                {
                    label: 'Test Field',
                    attribute: 'TestField'
                }
            ]
        },
        dispatch = (() => {}),
        fieldData = {
            TestField: 'True',
        },
        submitHandler = (() => {}),
        action = '',
        baseUrl = '',
        history = {};


    it('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={config}>
                <FormEmbeddedWrapped
                    page={page}
                    schema={schema}
                    dispatch={dispatch}
                    fieldData={fieldData}
                    submitHandler={submitHandler}
                    action={action}
                    baseUrl={baseUrl}
                    history={history}
                />
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
