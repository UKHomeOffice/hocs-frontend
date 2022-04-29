import React from 'react';
import Stage from '../stage.jsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('../form-enabled.jsx', () => (
    (C) => C
));

jest.mock('../../common/components/document-panel.jsx', () => (
    'div'
));

describe('Stage page component', () => {

    test('should render with titles when passed in props', () => {
        const mockForm = { caseReference: 'ABC123' };
        const wrapper = render(<Stage title='MY_TITLE' form={mockForm} hasSidebar='false' />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_TITLE')).toBeInTheDocument();
        expect(screen.getByText('ABC123')).toBeInTheDocument();
    });

    test('should render children when passed', () => {
        const child =
            <Stage hasSidebar='false'>
                FORM
            </Stage>;
        // eslint-disable-next-line react/no-children-prop
        const wrapper = render(<Stage title='MY_TITLE' hasSidebar='false' children={child} />);

        expect(wrapper).toBeDefined();
        expect(screen.getByText('FORM')).toBeInTheDocument();
    });

});
