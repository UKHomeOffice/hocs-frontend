import React from 'react';
import CheckboxGrid from '../checkbox-grid.jsx';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

const conditionChoices = [
    {
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'a',
        'choices': [
            {
                'label': 'one-a',
                'value': 'one-a'
            },
            {
                'label': 'two-a',
                'value': 'two-a'
            },
        ]
    },{
        'conditionPropertyName': 'conditionValue',
        'conditionPropertyValue': 'b',
        'choices': [
            {
                'label': 'one-b',
                'value': 'one-b'
            },
            {
                'label': 'two-b',
                'value': 'two-b'
            },
        ]
    },
];

describe('Form checkbox group component', () => {
    it('should render with default props', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} value={'A'} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} label="My text field" showLabel={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render checkboxWidth when passed', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" choices={choices} choicesPerRow="4ß" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <CheckboxGrid name="checkbox-group" choices={choices} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': '' });
    });
    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const firstValue = 'A';
        const secondValue = 'B';
        const wrapper = shallow(
            <CheckboxGrid name="checkbox-group" choices={choices} updateState={mockCallback} />
        );
        mockCallback.mockReset();

        wrapper.find(`#checkbox-group_${firstValue}`).simulate('change', { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'A' });

        wrapper.find(`#checkbox-group_${secondValue}`).simulate('change', { target: { value: secondValue } });
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'A,B' });

        wrapper.find(`#checkbox-group_${firstValue}`).simulate('change', { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback).toHaveBeenCalledWith({ 'checkbox-group': 'B' });
    });
    it('should render the correct condition choices pair ', () => {
        expect(
            render(<CheckboxGrid name="checkbox-group" conditionChoices={conditionChoices}
                data={{ 'conditionValue': 'b' }} updateState={() => null}
            />)
        ).toMatchSnapshot();
    });
});

