import React from 'react';
import ConfirmationWithCaseRef from '../confirmation-with-case-ref.jsx';
import { ApplicationProvider } from '../../../contexts/application.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Panel component', () => {
    const config = {
        csrf: '__token__'
    };

    xit('should render with default props', () => {
        expect(
            render(<ApplicationProvider>
                <ConfirmationWithCaseRef />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });


    it('should render with title when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <ConfirmationWithCaseRef label="completed" caseRef={'test-case-ref'}></ConfirmationWithCaseRef>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

});
