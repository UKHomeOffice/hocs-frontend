import React from 'react';
import TypeAhead from '../type-ahead.jsx';

const choices = [
    {
        label: 'Parent 1',
        options: [
            { label: 'Child 1', value: 'PARENT_1_CHILD_1' },
            { label: 'Child 2', value: 'PARENT_1_CHILD_2' },
        ]
    }
];

describe('Form type ahead component (dropdown)', () => {
    it('should render with default props', () => {
        expect(
            render(<TypeAhead name='type-ahead' updateState={() => null} />)
        ).toMatchSnapshot();
    });

    it('should render with label when passed', () => {
        expect(
            render(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                label='Type-ahead'
            />)
        ).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        expect(
            render(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                hint='Select an option'
            />)
        ).toMatchSnapshot();
    });

    it('should render with error when passed', () => {
        expect(
            render(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                error='Some error message'
            />)
        ).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        expect(
            render(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                disabled={true}
            />)
        ).toMatchSnapshot();
    });

});

describe('Form type ahead component (select)', () => {
    it('should render with default props', () => {
        expect(
            mount(<TypeAhead name='type-ahead' updateState={() => null} />)
        ).toMatchSnapshot();
    });

    it('should set componentMounted state when mounted', () => {
        const wrapper = mount(<TypeAhead
            name='type-ahead'
            updateState={() => null}
        />);
        expect(wrapper.state().componentMounted).toBeDefined();
        expect(wrapper.state().componentMounted).toEqual(true);
        expect(wrapper.find('Select')).toHaveLength(1);
    });

    it('should render with label when passed', () => {
        expect(
            mount(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                label='Type-ahead'
            />)
        ).toMatchSnapshot();
    });

    it('should render with hint when passed', () => {
        expect(
            mount(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                hint='Select an option'
            />)
        ).toMatchSnapshot();
    });

    it('should render with error when passed', () => {
        expect(
            mount(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                error='Some error message'
            />)
        ).toMatchSnapshot();
    });

    it('should render disabled when passed', () => {
        expect(
            mount(<TypeAhead
                name='type-ahead'
                updateState={() => null}
                disabled={true}
            />)
        ).toMatchSnapshot();
    });

    it('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        shallow(
            <TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />
        );
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'dropdown': undefined });
    });

    it('should execute callback on change', () => {
        const mockCallback = jest.fn();
        let value = choices[0].options[0].value;
        const wrapper = mount(
            <TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />
        );

        mockCallback.mockReset();
        const select = wrapper.find('Select');
        select.props().onChange({ value });
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'type-ahead': value });
    });

    it('should execute callback on change and support null value', () => {
        const mockCallback = jest.fn();
        const wrapper = mount(
            <TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />
        );

        mockCallback.mockReset();
        const select = wrapper.find('Select');
        select.props().onChange(null);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ 'type-ahead': null });
    });

    it('should filter search results based on input', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />
        );
        const instance = wrapper.instance();

        instance.getOptions('Child 1', optionGroups => {
            expect(optionGroups).toBeDefined();
            expect(optionGroups[1].options.length).toEqual(1);
        });

        instance.getOptions('Child', optionGroups => {
            expect(optionGroups).toBeDefined();
            expect(optionGroups[1].options.length).toEqual(2);
        });
    });

    it('should no search results based on empty', () => {
        const mockCallback = jest.fn();
        const wrapper = shallow(
            <TypeAhead name='type-ahead' choices={choices} updateState={mockCallback} />
        );
        const instance = wrapper.instance();

        instance.getOptions('', optionGroups => {
            expect(optionGroups).toBeDefined();
            expect(optionGroups.length).toEqual(0);
        });
    });

});

