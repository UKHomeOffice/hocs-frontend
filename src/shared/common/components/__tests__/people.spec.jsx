import React from 'react';
import WrappedPeople from '../people.jsx';
import { MemoryRouter } from 'react-router-dom';

const correspondents = [
    {
        'uuid': 'UUID_1',
        'created': '2020-05-28T11:29:23.102955',
        'type': 'CONSTITUENT',
        'caseUUID': 'CASE_UUID_1',
        'fullname': 'some_name',
        'organisation': 'Organisation 1',
        'address': {
            'postcode': 'WQ1 1PQ',
            'address1': 'a building',
            'address2': 'a street',
            'address3': 'a_city',
            'country': 'United Kingdom'
        },
        'telephone': '97498374827348',
        'email': 'name123@email.com',
        'reference': 'ref1',
        'externalKey': null,
        'isPrimary': true
    },
    {
        'uuid': 'UUID_2',
        'created': '2020-06-04T13:38:32.52298',
        'type': 'MEMBER',
        'caseUUID': 'CASE_UUID_2',
        'fullname': 'fname lname',
        'organisation': 'Organisation 2',
        'address': {
            'postcode': '',
            'address1': '',
            'address2': '',
            'address3': '',
            'country': ''
        },
        'telephone': '',
        'email': '',
        'reference': '',
        'externalKey': null,
        'isPrimary': false
    },
    {
        'uuid': 'UUID_3',
        'created': '2020-05-28T11:28:36.342184',
        'type': 'APPLICANT',
        'caseUUID': 'CASE_UUID_3',
        'fullname': 'my name',
        'organisation': 'Organisation 3',
        'address': {
            'postcode': 'ZR1 3PL',
            'address1': 'some house',
            'address2': 'some street',
            'address3': 'some_city',
            'country': 'United Kingdom'
        },
        'telephone': '01987876882342',
        'email': 'test@test.com',
        'reference': 'a reference',
        'externalKey': null,
        'isPrimary': false
    },
    {
        'uuid': 'UUID_4',
        'created': '2020-05-28T11:28:36.342184',
        'type': 'APPLICANT',
        'typeDisplayName': 'Applicant Test Case',
        'caseUUID': 'CASE_UUID_4',
        'fullname': 'my name',
        'organisation': 'Organisation 4',
        'address': {
            'postcode': 'ZR1 3PL',
            'address1': 'some house',
            'address2': 'some street',
            'address3': 'some_city',
            'country': 'United Kingdom'
        },
        'telephone': '01987876882342',
        'email': 'test@test.com',
        'reference': 'a reference',
        'externalKey': null,
        'isPrimary': false
    },
    {
        'uuid': 'UUID_5',
        'created': '2020-05-28T11:28:36.342184',
        'type': 'APPLICANT',
        'typeDisplayName': 'Applicant Test Case',
        'caseUUID': 'CASE_UUID_5',
        'fullname': 'my name',
        'organisation': 'Organisation 5',
        'address': {
            'postcode': 'ZR1 3PL',
            'address1': 'some house',
            'address2': 'some street',
            'address3': 'some_city',
            'country': 'United Kingdom'
        },
        'telephone': '01987876882342',
        'email': 'test@test.com',
        'reference': 'a reference',
        'externalKey': null,
        'isPrimary': true
    }
];

const emptyCorrespondents = [null];

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

describe('The people component', () => {

    it('should render successfully with 5 correspondent\'s', () => {
        const outer = shallow(<WrappedPeople/>);
        const People = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <People dispatch={jest.fn(() => Promise.resolve())} correspondents={correspondents} page={page}/>
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('People').props().correspondents).toBeDefined();
        expect(wrapper.find('People').props().page).toBeDefined();
        expect(wrapper.find('People').props().dispatch).toBeDefined();
    });

    it('should render successfully when there are no correspondents', () => {
        const outer = shallow(<WrappedPeople />);
        const People = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <People dispatch={jest.fn(() => Promise.resolve())} correspondents={emptyCorrespondents} page={page} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('People').props().correspondents).toBeDefined();
        expect(wrapper.find('People').props().page).toBeDefined();
        expect(wrapper.find('People').props().dispatch).toBeDefined();
    });
});
