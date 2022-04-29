import React from 'react';
import { DocumentAdd } from '../document-add.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const FIELD_NAME = 'add-document';

describe('Document add component', () => {

    test('should render with default props', () => {
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
    });

    test('should render disabled when passed', () => {
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByLabelText('Add document')).toBeDisabled();
    });

    test('should render with correct label when passed', () => {
        const label = 'MY_LABEL';
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} label={label} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_LABEL')).toBeInTheDocument();
    });

    test('should render with validation error when passed', () => {
        const error = 'MY_ERROR';
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} error={error} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_ERROR')).toBeInTheDocument();
    });

    test('should render with hint when passed', () => {
        const hint = 'MY_HINT';
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} updateState={() => null} disabled={true} hint={hint} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(screen.getByText('MY_HINT')).toBeInTheDocument();

    });

    test('should execute callback on initialization', () => {
        const mockCallback = jest.fn();
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: null });
    });

    test('should execute callback on change', () => {
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockCallback = jest.fn();
        const wrapper = render(
            <DocumentAdd dispatch={() => { }} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        mockCallback.mockReset();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith({ [FIELD_NAME]: [] });
    });

    test('should call the dispatch method on change', () => {
        const mockDispatch = jest.fn();
        const event = { target: { files: [] }, preventDefault: jest.fn() };
        const mockCallback = jest.fn();
        const wrapper = render(
            <DocumentAdd dispatch={mockDispatch} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={mockCallback} />,
            { wrapper: MemoryRouter }
        );
        expect(wrapper).toBeDefined();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({ 'payload': undefined, 'type': 'UPDATE_FORM_ERRORS' });
    });

    test('should add a validation error if the filesize is too large', () => {
        const event = { target: { files: [{ size: 1024 }] }, preventDefault: jest.fn() };
        const mockDispatch = jest.fn();
        const wrapper = render(
            <DocumentAdd dispatch={mockDispatch} maxUploadSize={1000} name={FIELD_NAME} disabled={true} updateState={() => {}} />,
            { wrapper: MemoryRouter }
        );
        mockDispatch.mockReset();
        fireEvent.change(wrapper.getByLabelText('Add document'),  event);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { 'payload': undefined, 'type': 'UPDATE_FORM_ERRORS' });
        expect(mockDispatch).toHaveBeenNthCalledWith(2, { 'payload': { 'add-document': 'The total file size is too large.  If you are uploading multiple files. Please try smaller batches.' }, 'type': 'UPDATE_FORM_ERRORS' });
    });

});
