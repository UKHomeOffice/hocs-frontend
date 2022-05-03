import React from 'react';
import Submit from '../submit.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Form button component', () => {
    it('should render with default props', () => {
        expect(
            render(<Submit />)
        ).toMatchSnapshot();
    });
    it('should render disabled when isDisabled is passed', () => {
        expect(
            render(<Submit disabled={true} />)
        ).toMatchSnapshot();
    });
    it('should render with correct when label is passed', () => {
        expect(
            render(<Submit label="Submit my form" />)
        ).toMatchSnapshot();
    });
});
