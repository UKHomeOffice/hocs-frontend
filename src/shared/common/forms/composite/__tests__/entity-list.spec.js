import React from 'react';
import EntityList from '../entity-list.jsx';

const FIELD_NAME = 'entity-list';

const choices = [
    { label: 'isA', value: 'A' },
    { label: 'isB', value: 'B' },
    { label: 'isC', value: 'C' }
];

describe('Document add component', () => {

    it('should render with default props', () => {
        const wrapper = render(<EntityList name={FIELD_NAME} updateState={() => null}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with value when passed', () => {
        expect(
            render(<EntityList name={FIELD_NAME} choices={choices} updateState={() => null} value="A" />)
        ).toMatchSnapshot();
    });

    it('should render default with first option when no value passed', () => {
        expect(
            render(<EntityList name={FIELD_NAME} choices={choices} updateState={() => null} />)
        ).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        const wrapper = mount(<EntityList name={FIELD_NAME} updateState={() => null} disabled={true}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('EntityList').props().disabled).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with correct label when passed', () => {
        const label = 'MY_LABEL'
        const wrapper = mount(<EntityList name={FIELD_NAME} updateState={() => null} label={label}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('EntityList').props().label).toEqual(label);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with validation error when passed', () => {
        const error = 'MY_ERROR';
        const wrapper = mount(<EntityList name={FIELD_NAME} updateState={() => null} error={error}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('EntityList').props().error).toEqual(error);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        const hint = 'MY_HINT';
        const wrapper = mount(<EntityList name={FIELD_NAME} choices={choices} updateState={() => null} hint={hint}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('EntityList').props().hint).toEqual(hint);
        expect(wrapper).toMatchSnapshot();

    });

    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <EntityList name={FIELD_NAME} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: null });
    });

    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <EntityList name={FIELD_NAME} choices={choices} updateState={mockCallback} />
        );
        mockCallback.mockReset();

        const firstValue = 'A';
        wrapper.find(`#${FIELD_NAME}-${firstValue}`).simulate('change', { target: { value: firstValue } });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: firstValue });

        const secondValue = 'B';
        wrapper.find(`#${FIELD_NAME}-${secondValue}`).simulate('change', { target: { value: secondValue } });
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: secondValue });
    });

});