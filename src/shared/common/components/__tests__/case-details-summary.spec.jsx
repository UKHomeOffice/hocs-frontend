import React from 'react';
import CaseDetailsSummary from '../case-details-summary';

const mockStages = {
    uuid: 'CASE_UUID',
    type: 'CASE_TYPE',
    reference: 'CASE_REF',
    timestamp: 'CASE_TIMESTAMP'
};

describe('Case details summary component', () => {

    it('should render with default props', () => {
        const wrapper = render(<CaseDetailsSummary {...mockStages} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});