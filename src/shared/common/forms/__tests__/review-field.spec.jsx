import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ReviewField from '../review-field';

const switchDirectionMock = jest.fn();

const REVIEW_FOR_RADIO_BUTTON = {
    direction: 'CHANGE_RADIO_BTN_SELECTION',
    child: {
        component: 'radio',
        validation: [
            'required'
        ],
        props: {
            'choices': [
                {
                    'label': 'Button One',
                    'value': 'BTN_1'
                },
                {
                    'label': 'Button Two',
                    'value': 'BTN_2'
                }
            ],
            label: 'Which button has been clicked?',
            name: 'TEST_RADIO_BTNS'
        },
        name: 'TEST_RADIO_REVIEW'
    },
    value: 'BTN_2',
    switchDirection: switchDirectionMock,
    name: 'RADIO_SUMMARY_TEST',
    page: {}
};

const REVIEW_FOR_DATE = {
    direction: 'CHANGE_DATE',
    child: {
        component: 'date',
        validation: [
            'required',
            'isValidDate',
            'isBeforeToday'
        ],
        'props': {
            'label': 'Date',
            'name': 'Date'
        }
    },
    value: '2021-11-01',
    switchDirection: switchDirectionMock,
    name: 'DATE_SUMMARY_TEST',
    page: {}
};

const REVIEW_FOR_TEXT_AREA = {
    direction: 'CHANGE_TEXT',
    child: {
        component: 'text-area',
        validation: [
            'required'
        ],
        props: {
            'label': 'Text area',
            'name': 'Text'
        }
    },
    value: 'Here is some text.',
    switchDirection: switchDirectionMock,
    name: 'TEXT_SUMMARY_TEST',
    page: {}
};

const REVIEW_FOR_CORRESPONDENTS = {
    child: {
        component: 'entity-list',
        validation: [
            'required'
        ],
        props: {
            action: 'CORRESPONDENT',
            entity: 'correspondent',
            label: 'Primary correspondent',
            name: 'Correspondents',
            choices: [
                {
                    label: 'Test',
                    value: 'TEST-KEY',
                    isPrimary: true
                }
            ]
        }
    },
    value: 'TEST-KEY',
    name: 'CORRESPONDENT',
    page: {
        caseId: 'ea258af3-cdd6-479c-92a7-06b3e33125f1',
        stageId: 'f36298c2-f400-4e7b-af17-a3eefb72e4a0'
    }
};

describe('Review component', () => {
    beforeEach(() => {
        switchDirectionMock.mockReset();
    });

    it('should display a text summary of a child radio button component', () => {
        expect(
            render(
                <MemoryRouter>
                    <ReviewField {...REVIEW_FOR_RADIO_BUTTON} />
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });

    it('should display a text summary of a date component', () => {
        expect(
            render(
                <MemoryRouter>
                    <ReviewField {...REVIEW_FOR_DATE} />
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });

    it('should display a text summary of a text component', () => {
        expect(
            render(
                <MemoryRouter>
                    <ReviewField {...REVIEW_FOR_TEXT_AREA} />
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });

    it('should display the primary correspondent given the correspondents entity-list', () => {
        expect(
            render(
                <MemoryRouter>
                    <ReviewField {...REVIEW_FOR_CORRESPONDENTS} />
                </MemoryRouter>
            )
        ).toMatchSnapshot();
    });

    it('should call switchDirection when Change is clicked for non-entity-list fields', () => {
        const component = mount(
            <MemoryRouter>
                <ReviewField {...REVIEW_FOR_TEXT_AREA} />
            </MemoryRouter>
        );

        const changeLink = component.find('a');
        changeLink.simulate('click');
        expect(switchDirectionMock).toHaveBeenCalledTimes(1);
    });
});
