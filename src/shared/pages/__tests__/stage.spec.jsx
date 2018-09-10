import React from 'react';
import Stage from '../stage.jsx';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

jest.mock('../../common/components/document-pane.jsx', () => (
    'div'
));

describe('Stage page component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Stage />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with title when passed in props', () => {
        const wrapper = render(<Stage title='MY_TITLE' />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with subTitle when passed in props', () => {
        const mockForm = { caseReference: 'ABC123' };
        const wrapper = render(<Stage form={mockForm} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render children when passed', () => {
        const wrapper = render(
            <Stage>
                FORM
            </Stage>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});