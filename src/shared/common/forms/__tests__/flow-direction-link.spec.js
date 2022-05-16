import React from 'react';
import { FlowDirectionLink } from '../flow-direction-link.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Form Flow Direction Link component', () => {

    const mockDispatch = jest.fn(() => Promise.resolve());
    const mockHistory = {};

    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should render with default props', () => {
        const wrappedButton = mount(<MemoryRouter><FlowDirectionLink action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('FlowDirectionLink')).toMatchSnapshot();
    });

    it('should render disabled when isDisabled is passed', () => {
        const wrappedButton = mount(<MemoryRouter><FlowDirectionLink action="/SOME/URL" disabled={true} dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('FlowDirectionLink')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().disabled).toEqual(true);
    });

    it('should render with correct label when passed', () => {
        const wrappedButton = mount(<MemoryRouter><FlowDirectionLink label={'My Button'} action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('BackBFlowDirectionLinkutton')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().disabled).toEqual(false);
        expect(wrappedButton.find('Link').props().children).toEqual('My Button');
    });

    it('should render with additional styles when className is passed', () => {
        const wrappedButton = mount(<MemoryRouter><FlowDirectionLink className={'test-class'} action="/SOME/URL" dispatch={mockDispatch}
            history={mockHistory} caseId='caseId123' stageId='stageId123' flowDirection='back' /></MemoryRouter>);
        expect(wrappedButton).toBeDefined();
        expect(wrappedButton.find('FlowDirectionLink')).toMatchSnapshot();
        expect(wrappedButton.find('Link').props().className).toEqual('govuk-body govuk-link test-class');
    });


});