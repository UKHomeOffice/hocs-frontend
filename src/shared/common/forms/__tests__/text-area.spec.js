import React from 'react';
import TextArea from '../text-area';

describe('Form text area component', () => {
    it('should render with default props', () => {
        expect(
            render(<TextArea name="text-field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<TextArea name="text-field" value="field value" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<TextArea name="text-field" label="My text field" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<TextArea name="text-field" hint="Put some text in the box below" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<TextArea name="text-field" error="Some error message" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<TextArea name="text-field" disabled={true} updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should render of type when passed', () => {
        expect(
            render(<TextArea name="text-field" type="password" updateState={() => null} />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        shallow(
            <TextArea name={fieldName} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: '' });
    });
    it('should execute callback on change', () => {
        const event = { target: { value: 'TextArea value' } };
        const mockCallback = jest.fn();
        const fieldName = 'text-field';
        const wrapper = shallow(
            <TextArea name={fieldName} updateState={mockCallback} />
        );
        mockCallback.mockReset();
        wrapper.find('textarea').simulate('blur', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [fieldName]: 'TextArea value' });
    });
});

