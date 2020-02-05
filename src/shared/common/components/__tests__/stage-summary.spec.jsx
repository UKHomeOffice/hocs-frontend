import React from 'react';
import WrappedSummary from '../stage-summary.jsx';

const mockStages = [
    {
        type: 'STAGE_TYPE',
        data: JSON.stringify({ field: 'VALUE' })
    }
];

const summary = {
    case: {
        created: '__created__',
        deadline: '__deadline__',
        received: '__received__'
    },
    primaryCorrespondent: {
        address: {
            address1: '__address1__',
            address2: '__address2__',
            address3: '__address3__',
            country: '__country__',
            postcode: '__postcode__',
        },
        fullname: '__fullname__'
    },
    primaryTopic: '__primaryTopic__',
    additionalFields: [
        { label: '__label__', value: '__value__' },
        { label: '__label__', value: '__value__' }
    ],
    deadlinesEnabled: true,
    deadlines: [
        { label: '__label__', value: '__value__' },
        { label: '__label__', value: '__value__' }
    ],
    stages: [{
        assignedTeam: '__assignedTeam__',
        assignedUser: '__assignedUser__',
        stage: '__stage__'
    }, {
        assignedTeam: '__assignedTeam__',
        assignedUser: '__assignedUser__',
        stage: '__stage__'
    }]
};

describe('Stage summary component', () => {
    it('should render with default props', () => {
        const outer = shallow(<WrappedSummary dispatch={jest.fn()} stages={mockStages} />);
        const Summary = outer.props().children;
        const wrapper = render(<Summary dispatch={jest.fn()} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render with summary data', () => {
        const outer = shallow(<WrappedSummary dispatch={jest.fn()} stages={mockStages} />);
        const Summary = outer.props().children;
        const wrapper = render(<Summary dispatch={jest.fn()} summary={summary} />);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
