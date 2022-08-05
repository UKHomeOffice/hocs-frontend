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
            }
        },
        dispatch = (() => {}),
        fieldData = {},
        submitHandler = (() => {}),
        action = '',
        baseUrl = '';


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
                />
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
