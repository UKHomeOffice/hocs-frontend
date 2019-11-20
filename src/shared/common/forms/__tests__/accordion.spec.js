import React from 'react';
import Accordion from '../accordion';

const createItem = name => ({ props: { name } });

describe('When the Accordion component is rendered', () => {
    const updateState = jest.fn();
    const sections = [{
        items: [createItem('item1'), createItem('item2'), createItem('item2')],
        title: 'section1'
    }, {
        items: [createItem('item4'), createItem('item5'), createItem('item6')],
        title: 'section2'
    }];

    describe('and there are no validation errors', () => {
        it('should match the snapshot', () => {
            const instance = shallow(<Accordion name="accordion" sections={sections} data={{}} updateState={updateState} />);
            expect(instance.html()).toMatchSnapshot();
        });
    });

    describe('and there are validation errors', () => {
        it('should match the snapshot, having the effected section expanded', () => {
            const instance = shallow(<Accordion name="accordion" errors={{ item1: 'A validation error' }} sections={sections} data={{}} updateState={updateState} />);
            expect(instance.html()).toMatchSnapshot();
        });
    });
});
