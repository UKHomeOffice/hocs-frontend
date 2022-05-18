import React from 'react';
import Case from '../case.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

jest.mock('../../common/components/document-panel.jsx', () => (
    'div'
));

describe('Case page component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Case />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with title when passed in props', () => {
        const wrapper = render(<Case title='MY_TITLE' />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with subTitle when passed in props', () => {
        const mockForm = { caseReference: 'ABC123' };
        const wrapper = render(<Case form={mockForm} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render children when passed', () => {
        const wrapper = render(
            <Case>
                FORM
            </Case>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});
