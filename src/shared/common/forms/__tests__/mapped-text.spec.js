import React from 'react';
import MappedText from '../mapped-text.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

describe('Form MappedText component', () => {
    it('should render with default props', () => {
        expect(
            render(<MappedText name="mapped-text-field" choices={choices} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<MappedText name="mapped-text-field" choices={choices} value={'A'} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<MappedText name="mapped-text-field" choices={choices} label="My mapped-text field" />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<MappedText name="mapped-text-field" choices={choices} hint="A hint for mapped-text field" />)
        ).toMatchSnapshot();
    });

});

