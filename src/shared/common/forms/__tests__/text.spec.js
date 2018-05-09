import React from 'react';
import Text from '../text.jsx';

describe('Form text component', () => {
    it('should render with default props', () => {
        expect(
            render(<Text/>)
        ).toMatchSnapshot();
    });
    it('should render with value when passed', () => {
        expect(
            render(<Text value="field value"/>)
        ).toMatchSnapshot();
    });
    it('should render with label when passed', () => {
        expect(
            render(<Text label="My text field"/>)
        ).toMatchSnapshot();
    });
    it('should render with hint when passed', () => {
        expect(
            render(<Text hint="Put some text in the box below"/>)
        ).toMatchSnapshot();
    });
    it('should render with error when passed', () => {
        expect(
            render(<Text error="Some error message"/>)
        ).toMatchSnapshot();
    });
    it('should render disabled when passed', () => {
        expect(
            render(<Text disabled={true}/>)
        ).toMatchSnapshot();
    });
    it('should render of type when passed', () => {
        expect(
            render(<Text type="password"/>)
        ).toMatchSnapshot();
    });
    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <Text name='Text' updateState={mockCallback}/>
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({Text: ''});
    });
    it('should execute callback on change', () => {
        const event = {target: {value: 'Text value'}};
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <Text name='Text' updateState={mockCallback}/>
        );
        mockCallback.mockReset();
        wrapper.find('input').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({Text: 'Text value'});
    });
});

