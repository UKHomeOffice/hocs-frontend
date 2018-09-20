import React from 'react';
import Action from '../action.jsx';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

describe('Action page component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Action />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with title when passed in props', () => {
        const wrapper = render(<Action title='MY_TITLE' />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with subTitle when passed in props', () => {
        const wrapper = render(<Action subTitle='MY_SUBTITLE' />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render children when passed', () => {
        const wrapper = render(
            <Action>
                FORM
            </Action>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});