import React from 'react';
import { BackButton } from '../back-button.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Form back button component', () => {

    const mockDispatch = jest.fn(() => Promise.resolve());
    const mockHistory = {};

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrappedButton = mount(<MemoryRouter><BackButton action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('BackButton')).toMatchSnapshot();
    });

    it('should render disabled when isDisabled is passed', () => {
        const wrappedButton = mount(<MemoryRouter><BackButton action="/SOME/URL" disabled={true} dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('BackButton')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().disabled).toEqual(true);
    });

    it('should render with correct label when passed', () => {
        const wrappedButton = mount(<MemoryRouter><BackButton label={'My Button'} action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('BackButton')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().disabled).toEqual(false);
        expect(wrappedButton.find('Link').props().children).toEqual('My Button');
    });

    it('should render with additional styles when className is passed', () => {
        const wrappedButton = mount(<MemoryRouter><BackButton className={'test-class'} action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('BackButton')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().className).toEqual('govuk-back-link test-class');
    });


});