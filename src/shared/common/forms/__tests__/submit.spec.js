import React from 'react';
import Submit from '../submit.jsx';

describe('Form button component', () => {
    it('should render with default props', () => {
        expect(
            render(<Submit />)
        ).toMatchSnapshot();
    });
    it('should render disabled when isDisabled is passed', () => {
        expect(
            render(<Submit isDisabled />)
        ).toMatchSnapshot();
    });
    it('should render with correct when label is passed', () => {
        expect(
            render(<Submit label="Submit my form" />)
        ).toMatchSnapshot();
    });
    it('should render with additional styles when className is passed', () => {
        expect(
            render(<Submit className="start" />)
        ).toMatchSnapshot();
    });
});