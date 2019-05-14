import React from 'react';
import Panel from '../panel.jsx';

describe('Panel component', () => {

    xit('should render with default props', () => {
        expect(
            render(<Panel />)
        ).toMatchSnapshot();
    });

    it('should render with content when passed', () => {
        expect(
            render(<Panel>Testing the Panel component</Panel>)
        ).toMatchSnapshot();
    });

    it('should render with title when passed', () => {
        expect(
            render(<Panel title="Testing">Testing the Panel component</Panel>)
        ).toMatchSnapshot();
    });

});