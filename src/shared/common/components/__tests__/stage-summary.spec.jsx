import React from 'react';
import Stage from '../stage-summary.jsx';

const mockStages = [
    {
        type: 'STAGE_TYPE',
        data: JSON.stringify({ field: 'VALUE' })
    }
];

describe('Stage summary component', () => {

    it('should render with default props', () => {
        const wrapper = render(<Stage stages={mockStages} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

});