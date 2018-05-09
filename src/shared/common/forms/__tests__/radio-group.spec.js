import React from 'react';
import RadioGroup from '../radio-group.jsx';

const choices = [
    {label: 'isA', value: 'A'},
    {label: 'isB', value: 'B'},
    {label: 'isC', value: 'C'}
];

describe('Form radio group component', () => {
    it('should render with default props', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices}/>)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} value="A"/>)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} label="My text field"/>)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} hint="Put some text in the box below"/>)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} error="Some error message"/>)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} disabled={true}/>)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <RadioGroup name="radio-group" choices={choices} updateState={mockCallback}/>
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({'radio-group': 'A'});
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let firstValue = 'A';
        let secondValue = 'B';
        const wrapper = shallow(
            <RadioGroup name="radio-group" choices={choices} updateState={mockCallback}/>
        );

        mockCallback.mockReset();

        wrapper.find(`#radio-group-${firstValue}`).simulate('change', {target: {value: firstValue}});
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({'radio-group': firstValue});

        wrapper.find(`#radio-group-${secondValue}`).simulate('change', {target: {value: secondValue}});
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({'radio-group': secondValue});
    });
});

