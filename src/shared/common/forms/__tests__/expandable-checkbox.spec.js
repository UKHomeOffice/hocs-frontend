import React from 'react';
import ExpandableCheckbox from '../expandable-checkbox.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const choice = {
    label: '__label__',
    value: '__value__'
};

describe('When the component is rendered', () => {
    it('should match the snapshot', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} label="__label__" name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered with a hint', () => {
    it('should match the snapshot', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} label="__label__" hint="__hint__" name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
        expect(screen.getByText('__hint__')).toBeInTheDocument();
    });
});

describe('When the component is rendered and it is not checked and it has child components', () => {
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];

    it('should match the snapshot - the child components should not be displayed', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered and it is checked and it has child components', () => {
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];

    it('should match the snapshot - the child components should not be initially displayed by default', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={() => { }} value="__value__" />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered and it is selected and it has child components and the initiallyOpen prop', () => {
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];

    it('should match the snapshot - the child components should be initially displayed', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{ '__name__': '__value__' }} initiallyOpen={true} items={items} label="__label__" name="__name__" updateState={() => { }} value="__value__" />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered', () => {
    it('should render checked if the value matches', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} label="__label__" name="__name__" updateState={() => { }} value="__value__" />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered', () => {
    it('should render unchecked if the value doesnt match', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} label="__label__" name="__name__" updateState={() => { }} value="__notvalue__" />))
            .toMatchSnapshot();
    });
});

describe('When the Details link is clicked', () => {
    it('should show the child items', () => {
        const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];
        render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={() => { }} value="__value__" />);
        fireEvent.click(screen.getByRole('link'));
        expect(screen.getByText('Hide Details')).toBeInTheDocument();
    });
});

describe('When the Details link is clicked twice', () => {
    it('should not show the child items', () => {
        const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];
        render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={() => { }} value="__value__" />);
        fireEvent.click(screen.getByRole('link'));
        fireEvent.click(screen.getByRole('link'));
        expect(screen.getByText('Show Details')).toBeInTheDocument();
    });
});

describe('When the checkbox clicked', () => {
    const updateStateMock = jest.fn();
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];
    beforeEach(() => {
        updateStateMock.mockReset();
    });

    describe('And it is currently not selected', () => {
        it('should call the callback with the selected value', () => {
            render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={updateStateMock} value="__notvalue__" />);
            fireEvent.click(screen.getByRole('checkbox'));
            expect(updateStateMock).toHaveBeenCalledWith({ '__name__': '__value__' });
        });
    });

    describe('And it is currently selected', () => {
        it('should call the callback with empty', () => {
            render(<ExpandableCheckbox choice={choice} data={{}} items={items} label="__label__" name="__name__" updateState={updateStateMock} value="__value__" />);
            fireEvent.click(screen.getByRole('checkbox'));
            expect(updateStateMock).toHaveBeenCalledWith({ '__name__': '' });
        });
    });
});


describe('When the component is rendered a child component has errors', () => {
    const items = [{ component: 'inset', props: { name: 'child1' } }, { component: 'inset', props: { name: 'child2' } }, { component: 'inset', props: { name: 'child3' } }];
    const errors = { child1: 'an error' };
    it('should render expanded', () => {
        render(<ExpandableCheckbox choice={choice} data={{}} errors={errors} items={items} label="__label__" name="__name__" updateState={() => { }} />);
        expect(screen.getByText('Hide Details')).toBeInTheDocument();
    });
});
