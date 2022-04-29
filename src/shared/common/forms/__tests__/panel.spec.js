import React from 'react';
import Panel from '../panel.jsx';
import { ApplicationProvider } from '../../../contexts/application.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Panel component', () => {
    const config = {
        csrf: '__token__'
    };

    xit('should render with default props', () => {
        expect(
            render(<ApplicationProvider>
                <Panel />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render with content when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <Panel>Testing the Panel component</Panel>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render with title when passed', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <Panel title="Testing">Testing the Panel component</Panel>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

});
