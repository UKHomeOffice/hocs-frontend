import React from 'react';
import RadioGroup from '../radio-group.jsx';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' },
];

describe('Form radio group component', () => {
    it('should render with default props', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} value="A" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<RadioGroup name="radio-group" choices={choices} disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <RadioGroup name="radio-group" choices={choices} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': undefined });
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let firstValue = 'A';
        let secondValue = 'B';
        const wrapper = shallow(
            <RadioGroup name="radio-group" choices={choices} updateState={mockCallback} />
        );

        mockCallback.mockReset();

        wrapper.find('#radio-group-0').simulate('change', { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': firstValue });

        wrapper.find('#radio-group-1').simulate('change', { target: { value: secondValue } });
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'radio-group': secondValue });
    });
    it('should textarea if conditional content exists', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA', conditionalContent: { label: 'someLabel' } },
            { label: 'labelB', value: 'ValueB' },
            { label: 'labelC', value: 'ValueC' }
        ];
        expect(
            render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render error message for textarea if correct error exists in errors object', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA', conditionalContent: { label: 'someLabel' } },
            { label: 'labelB', value: 'ValueB' },
            { label: 'labelC', value: 'ValueC' }
        ];
        expect(
            render(<RadioGroup name="radio-group" choices={choices} errors={{ ValueAText: 'Some error message' }} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render if visible is set to true', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA' },
            { label: 'labelB', value: 'ValueB', visible: true },
            { label: 'labelC', value: 'ValueC', visible: 'true' },
        ];
        expect(
            render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should not render choices if visible is set to false', () => {
        const choices = [
            { label: 'labelA', value: 'ValueA' },
            { label: 'labelB', value: 'ValueB', visible: false },
            { label: 'labelC', value: 'ValueC', visible: 'false' },
        ];
        expect(
            render(<RadioGroup name="radio-group" choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });
});
