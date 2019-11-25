import React from 'react';
import WrappedDocumentAdd from '../document-add.jsx';

const FIELD_NAME = 'add-document';

describe('Document add component', () => {

    it('should render with default props', () => {
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} />);
        const DocumentAdd = outer.props().children;
        const wrapper = render(<DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={() => null} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} disabled={true} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(<DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={() => null} disabled={true} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentAdd').props().disabled).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('should allow multiple files when passed', () => {
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} allowMultiple={true} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(<DocumentAdd dispatch={() => { }} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentAdd').props().allowMultiple).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with correct label when passed', () => {
        const label = 'MY_LABEL';
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} label={label} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(<DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={() => null} allowMultiple={true} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentAdd').props().label).toEqual(label);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with validation error when passed', () => {
        const error = 'MY_ERROR';
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} error={error} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(<DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={() => null} error={error} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentAdd').props().error).toEqual(error);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        const hint = 'MY_HINT';
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => null} hint={hint} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(<DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={() => null} hint={hint} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('DocumentAdd').props().hint).toEqual(hint);
        expect(wrapper).toMatchSnapshot();

    });

    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={mockCallback} />);
        const DocumentAdd = outer.props().children;
        mount(
            <DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: null });
    });

    it('should execute callback on change', () => {
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockCallback = jest.fn();
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={mockCallback} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(
            <DocumentAdd dispatch={() => { }} name={FIELD_NAME} updateState={mockCallback} />
        );
        mockCallback.mockReset();
        wrapper.find('input').simulate('change', event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: [] });
    });

    it('should call the dispatch method on change', () => {
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockDispatch = jest.fn();
        const outer = shallow(<WrappedDocumentAdd name={FIELD_NAME} updateState={() => { }} />);
        const DocumentAdd = outer.props().children;
        const wrapper = mount(
            <DocumentAdd dispatch={mockDispatch} name={FIELD_NAME} updateState={() => { }} />
        );
        mockDispatch.mockReset();
        wrapper.find('input').simulate('change', event);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': undefined, 'type': 'UPDATE_FORM_ERRORS' });
    });

});