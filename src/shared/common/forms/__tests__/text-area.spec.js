import React from 'react';
import TextArea from '../text-area';

describe('Form text area component', () => {
    it('should render with default props', () => {
        expect(
            render(<TextArea />)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<TextArea value="field value" />)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<TextArea label="My text field" />)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<TextArea hint="Put some text in the box below" />)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<TextArea error="Some error message" />)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<TextArea disabled={true} />)
        ).toMatchSnapshot();
    });
    it('should render of type when passed', () => {
        expect(
            render(<TextArea type="password" />)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <TextArea name='TextArea' updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ TextArea: '' });
    });
    it('should execute callback on change', () => {
        const event = { target: { value: 'TextArea value' } };
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <TextArea name='TextArea' updateState={mockCallback} />
        );
        mockCallback.mockReset();
        wrapper.find('textarea').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ TextArea: 'TextArea value' });
    });
});

