import React from 'react';
import ParentTopicReviewField from '../review-field-parent-topic.jsx';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const parentTopicChoices = [
    {
        'label': 'Parent Topic 1',
        'value': 'parent_1',
        'options': [
            {
                'label': 'Topic 11',
                'value': 'topic_11',
                'active': true
            },
            {
                'label': 'Topic 12',
                'value': 'topic_12',
                'active': true
            }
        ]
    },
    {
        'label': 'Parent Topic 2',
        'value': 'parent_2',
        'options': [
            {
                'label': 'Topic 21',
                'value': 'topic_21',
                'active': true
            },
            {
                'label': 'Topic 22',
                'value': 'topic_22',
                'active': true
            }
        ]
    }
];



describe('Review Field Parent Topic',  () => {

    it('Should Render Topic in review field', () => {
        const name = 'TEST NAME';
        const type = 'TEST TYPE';
        const value = 'topic_21';
        const page = {
            caseId: 'case_id',
            stage: 'stage_id'
        };

        const child = {
            component: 'type-ahead',
            props: {
                choices: parentTopicChoices
            }
        };

        const wrapper = render(<ParentTopicReviewField
            name={name}
            child={child}
            type={type}
            value={value}
            page={page}/>
        );

        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
