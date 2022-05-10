import React from 'react';
import DocumentAdd from '../document-add.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationProvider } from '../../../../contexts/application';

const FIELD_NAME = 'add-document';

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

const BASE_URL = 'http://localhost:8080';
const MOCK_CALLBACK = jest.fn();
const MOCK_TRACK = jest.fn();
const MOCK_CONFIG = {
    track: MOCK_TRACK,
    page: page,
    baseUrl: BASE_URL,
};
const DEFAULT_PROPS = {
    page: page,
    baseUrl: BASE_URL,
    updateState: MOCK_CALLBACK,
    track: MOCK_TRACK,
    config: MOCK_CONFIG
};

describe('Document add component', () => {

    test('should render with default props', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByLabelText('Add document')).toBeDisabled();
    });

    test('should render with correct label when passed', () => {
        const label = 'MY_LABEL';
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} label={label} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_LABEL')).toBeInTheDocument();
    });

    test('should render with validation error when passed', () => {
        const error = 'MY_ERROR';
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} error={error} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_ERROR')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const hint = 'MY_HINT';
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} hint={hint} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_HINT')).toBeInTheDocument();

    });

    test('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: null });
    });

    test('should execute callback on change', () => {
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockCallback = jest.fn();
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        mockCallback.mockReset();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: [] });
    });

    // @TODO: Marked this test as skipped due to inability to inject a dispatch method into the ApplicationProvider;
    // In the current implementation there is no way to inject a different dispatch method as it's
    // initialised in the constructor of the ApplicationProvider.
    test.skip('should call the dispatch method on change', () => {
        const mockDispatch = jest.fn();
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockCallback = jest.fn();
        const label = 'Add document';
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={mockDispatch} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} label={label} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        mockDispatch.mockReset();
        expect(wrapper).toBeDefined();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': undefined, 'type': 'UPDATE_FORM_ERRORS' });
    });

    // @TODO: Marked this test as skipped due to inability to inject a mock dispatch method into the ApplicationProvider;
    // In the current implementation there is no way to inject a different dispatch method as it's
    // initialised in the constructor of the ApplicationProvider.
    test.skip('should add a validation error if the filesize is too large', () => {
        const event = { target: { files: [{ size: 1024 }] }, preventDefault: jest.fn() };
        const mockDispatch = jest.fn();
        const wrapper = render(
            <ApplicationProvider config={{ ...MOCK_CONFIG, ...DEFAULT_PROPS }}>
                <MemoryRouter>
                    <DocumentAdd dispatch={mockDispatch} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={() => {}} />
                </MemoryRouter>
            </ApplicationProvider>
        );
        mockDispatch.mockReset();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { 'payload': undefined, 'type': 'UPDATE_FORM_ERRORS' });
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { 'payload': { 'add-document': 'The total file size is too large.  If you are uploading multiple files. Please try smaller batches.' }, 'type': 'UPDATE_FORM_ERRORS' });
    });

});
