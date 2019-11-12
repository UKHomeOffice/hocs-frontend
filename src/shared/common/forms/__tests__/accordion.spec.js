import React from 'react';
import Accordion from '../accordion';


describe('When the Accordion component is rendered', () => {
    const updateState = jest.fn();
    const sections = [{
        items: [1, 2, 3],
        title: 'section1'
    }, {
        items: [1, 2, 3],
        title: 'section2'
    }];
    it('should match the snapshot', () => {
        const instance = shallow(<Accordion name="accordion" sections={sections} data={{}} updateState={updateState} />);
        expect(instance.html()).toMatchSnapshot();
    });
});
