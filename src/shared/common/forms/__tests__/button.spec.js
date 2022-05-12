import React from 'react';
import Button from '../button.jsx';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ApplicationProvider } from '../../../contexts/application';

const PAGE = { params: { caseId: '1234', stageId: '5678' } };
const NAME = 'entity_list';
const ENTITY = 'entity';
const BASE_URL = 'http://localhost:8080';
const MOCK_CALLBACK = jest.fn();
const MOCK_CONFIG = {
    page: PAGE,
    baseUrl: BASE_URL,
};

const DEFAULT_PROPS = {
    page: PAGE,
    name: NAME,
    entity: ENTITY,
    baseUrl: BASE_URL,
    updateState: MOCK_CALLBACK
};

describe('Form button component', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <Button action={'/SOME/URL'} label={'press'} dispatch={() => {}} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('press')).toBeInTheDocument();
    });

    it('should render disabled when isDisabled is passed', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <Button action={'/SOME/URL'} label={'press'} dispatch={() => {}} disabled={true} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('press')).toHaveAttribute('disabled');
    });
});
