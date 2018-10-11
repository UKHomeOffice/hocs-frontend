import React from 'react';
import Card from '../card.jsx';
import { MemoryRouter } from 'react-router-dom';

const DEFAULT_PROPS = {
    count: 5,
    label: 'Test Item',
    url: '/'
};

describe('Card component', () => {
    it('should render with default props', () => {
        expect(
            render(
                <MemoryRouter>
                    <Card {...DEFAULT_PROPS} />
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });

    it('should render with footer when children passed in props', () => {
        expect(
            render(
                <MemoryRouter>
                    <Card {...DEFAULT_PROPS}>
                        Footer
                    </Card>
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });
});

