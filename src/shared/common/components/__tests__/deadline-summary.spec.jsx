import React from 'react';
import DeadlineSummary from '../deadline-summary.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Deadline summary component', () => {

    const DEFAULT_PROPS = {
        deadlines: [
            { date: '2020-01-01', type: 'Deadline A' },
            { date: '2020-01-01', type: 'Deadline B' }
        ]
    };

    it('should render with default props', () => {
        const WRAPPER = render(<DeadlineSummary {...DEFAULT_PROPS} />);
        expect(WRAPPER).toBeDefined();
        expect(WRAPPER).toMatchSnapshot();
    });

});
