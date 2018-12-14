import React from 'react';
import WrappedSummary from '../stage-summary.jsx';

const mockStages = [
    {
        type: 'STAGE_TYPE',
        data: JSON.stringify({ field: 'VALUE' })
    }
];

describe('Stage summary component', () => {

    it('should render with default props', () => {
        const outer = shallow(<WrappedSummary dispatch={jest.fn()} stages={mockStages} />);
        const Summary = outer.props().children;
        const wrapper = render(<Summary />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});