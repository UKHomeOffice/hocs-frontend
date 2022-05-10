import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DocumentPanel from '../document-panel.jsx';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationProvider } from '../../../contexts/application';

const MOCK_TRACK = jest.fn();

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const MOCK_CONFIG = {
    track: MOCK_TRACK,
    page
};

describe('Document panel component', () => {

    let mockDispatch;

    const documentList = [
        ['group 1', [
            { label: 'TEST_DOCUMENT_1', value: 'MOCK_DOC_ID_1', status: 'UPLOADED' },
            { label: 'TEST_DOCUMENT_2', value: 'MOCK_DOC_ID_2', status: 'UPLOADED' },
            { label: 'TEST_DOCUMENT_3', value: 'MOCK_DOC_ID_3', status: 'PENDING' },
        ]], ['group 2', [
            { label: 'TEST_DOCUMENT_4', value: 'MOCK_DOC_ID_4', status: 'UPLOADED' },
            { label: 'TEST_DOCUMENT_5', value: 'MOCK_DOC_ID_5', status: 'UPLOADED' },
            { label: 'TEST_DOCUMENT_6', value: 'MOCK_DOC_ID_6', status: 'UPLOADED' },
        ]], ['group 3', [
            { label: 'TEST_DOCUMENT_7', value: 'MOCK_DOC_ID_7', status: 'UPLOADED' },
            { label: 'TEST_DOCUMENT_8', value: 'MOCK_DOC_ID_8', status: 'PENDING' },
            { label: 'TEST_DOCUMENT_9', value: 'MOCK_DOC_ID_9', status: 'PENDING' },
        ]]
    ];

    beforeEach(() => {
        mockDispatch = jest.fn(() => Promise.resolve());
    });

    afterEach(() => {
        mockDispatch.mockReset();
    });

    test('should render the document panel', () => {
        const defaultProps = {
            summary: {
                type: 'default'
            },
            page: page,
            track: MOCK_TRACK,
            config: MOCK_CONFIG,
            dispatch: mockDispatch,
            documents: documentList,
        };

        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...defaultProps }}>
                <MemoryRouter>
                    <DocumentPanel />
                </MemoryRouter>
            </ApplicationProvider>);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Manage Documents')).toBeInTheDocument();
    });

});
