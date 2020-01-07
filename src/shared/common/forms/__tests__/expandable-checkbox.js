import React from 'react';
import ExpandableCheckbox from '../expandable-checkbox.jsx';

const choice = {
    label: '__label__',
    value: '__value__'
};

describe('When the component is rendered', () => {
    it('should match the snapshot', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered and it has child components', () => {
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];

    it('should match the snapshot - the child components should not be initially displayed by default', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} items={items} name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered and it has child components and the initiallyOpen prop', () => {
    const items = [{ component: 'inset', props: {} }, { component: 'inset', props: {} }, { component: 'inset', props: {} }];

    it('should match the snapshot - the child components should be initially displayed', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} initiallyOpen={true} items={items} name="__name__" updateState={() => { }} />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered', () => {
    it('should render checked if the value matches', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} name="__name__" updateState={() => { }} value="__value__" />))
            .toMatchSnapshot();
    });
});

describe('When the component is rendered', () => {
    it('should render unchecked if the value doesnt match', () => {
        expect(render(<ExpandableCheckbox choice={choice} data={{}} name="__name__" updateState={() => { }} value="__notvalue__" />))
            .toMatchSnapshot();
    });
});
