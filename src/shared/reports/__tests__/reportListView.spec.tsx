import { buildCompletablePromise } from './buildCompletablePromise.spec.utils';
import ReportListView, { ReportSummary } from '../reportListView';
import { act, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';

import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn()
}));

const axiosGetMock = axios.get as jest.Mock;

function givenApiResponses(overrides: { [key: string]: Promise }) {
    axiosGetMock.mockImplementation(url => {
        const [,caseType] = url.match(/^\/api\/report\/([A-Z0-9]+)$/) ?? [];
        return overrides[caseType] ?? Promise.reject({ response: { status: 404 } });
    });
}

function getResponseFor(data: ReportSummary[]) {
    return Promise.resolve({ status: 200, data } );
}

describe('A page to show a list of available reports', () => {
    it('Shows loading and error messages', async () => {
        const eventualError = buildCompletablePromise();
        givenApiResponses({ COMP: eventualError });

        render(<ReportListView />);

        expect(await screen.findByText('List of operational reports')).toBeVisible();
        expect(await screen.findByText('Loading reports')).toBeVisible();

        const error = 'An error occurred retrieving report data';
        await act(() => eventualError.reject({ response: { status: 500, data: { error } } }));

        expect(await screen.findByText('Something went wrong')).toBeVisible();
        expect(await screen.findByText(error)).toBeVisible();
    });

    it('Ignores not found and permission errors, showing a message if no reports are returned', async () => {
        givenApiResponses({
            'COMP': Promise.reject({ response: { status: 401 } }),
            'COMP2': Promise.reject({ response: { status: 403 } }),
            'MPAM': Promise.reject({ response: { status: 404 } }),
        });

        render(<ReportListView />);

        expect(await screen.findByText('List of operational reports')).toBeVisible();
        expect(await screen.findByText('You don\'t have permission to access any operational reports.')).toBeVisible();
    });

    it('Renders a list of reports the user has permission to access', async () => {
        const openCasesSummary: ReportSummary = {
            slug: 'open-cases',
            display_name: 'Open cases report',
            description: 'This is the description for the open cases report',
        };
        const workInProgressSummary: ReportSummary = {
            slug: 'work-in-progress',
            display_name: 'Work in progress report',
            description: 'This is the description for the work in progress report',
        };

        givenApiResponses({
            'COMP': getResponseFor([openCasesSummary, workInProgressSummary]),
            'COMP2': getResponseFor([workInProgressSummary]),
        });

        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <ReportListView />
            </Router>
        );

        expect(await screen.findByText('List of operational reports')).toBeVisible();

        expect(await screen.findByText('COMP')).toBeVisible();
        expect(await screen.findByText('COMP2')).toBeVisible();

        expect(await screen.findAllByText('Open cases report')).toHaveLength(1);
        expect(await screen.findAllByText('This is the description for the open cases report'))
            .toHaveLength(1);

        expect(await screen.findAllByText('Work in progress report')).toHaveLength(2);
        expect(await screen.findAllByText('This is the description for the work in progress report'))
            .toHaveLength(2);

        expect(document.querySelector('[href="/report/COMP/open-cases"]')).toHaveTextContent(
            'View COMP open cases report'
        );
    });
});
