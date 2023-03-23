import dayjs from 'dayjs';
import React from 'react';
import ReportView from '../reportView';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import qs from 'qs';

import { get } from 'axios';
import { ReportMetadata, ReportRow } from '../components/dataTable';
import { Route } from 'react-router';

jest.mock('axios', () => ({
    get: jest.fn()
}));

const axiosGetMock = get as jest.Mock;

function buildCompletablePromise<T>(): Promise<T> & {reject: (err: unknown) => void, resolve: (t: T) => void} {
    let resolveFn, rejectFn;
    const promise = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });
    promise.resolve = resolveFn;
    promise.reject = rejectFn;

    return promise;
}

function givenUrl({ reportSlug = 'test-report', caseType = 'COMP', searchQuery = {} }) {
    const baseUrl = `/report/${caseType}/${reportSlug}`;
    const search = Object.keys(searchQuery).length > 0
        ? `?${qs.stringify(searchQuery, { arrayFormat: 'brackets' })}`
        : '';

    const history = createMemoryHistory();
    history.push(`${baseUrl}${search}`);

    return {
        match: {
            isExact: true,
            params: {
                reportSlug,
                caseType,
            },
            url: baseUrl,
            path: '/report/:caseType/:reportSlug'
        },
        history
    };
}

const today = dayjs('2023-04-03');

const MONDAYS = ['2023-04-03', '2023-04-10', '2023-04-17', '2023-04-24', '2023-03-06', '2023-02-06'].map(dayjs);
const STRINGS = [
    'test phrase one', 'test phrase two', 'test phrase three', 'test phrase four',
    'another test one', 'another test two', 'another test three',
];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

function getDate(index: number) {
    const monday = MONDAYS[index % MONDAYS.length];
    // Spread past dates more sparsely over a month
    const pickWeek = monday.add(monday.isBefore(today) ? Math.floor(index / MONDAYS.length) % 4 : 0, 'weeks');
    // Spread evenly Monday - Friday
    const pickDay = pickWeek.add(Math.floor(index / MONDAYS.length) % 5, 'days');

    return pickDay.format('YYYY-MM-DD');
}

const TEST_DATA: ReportRow[] = Array.from({ length: 500 }, (_, i) => ({
    ref: `${LETTERS[i % LETTERS.length]}-${i + 100_000}/23`,
    number: (i * 11) % 500,
    date: getDate(i),
    boolean: i % 2 === 0,
    string: STRINGS[i % STRINGS.length],
    letter: LETTERS[i % LETTERS.length],
}));

const TEST_META: ReportMetadata = {
    slug: 'test-report',
    display_name: 'Test report',
    columns: [
        {
            key: 'ref',
            display_name: 'Reference',
            type: 'LINK',
            render_on_dashboard: true,
            render_in_csv: true,
            filter_type: 'EXACT_TEXT',
            additional_fields: { 'link_pattern': '/resource/${letter}/${ref}' },
        },
        {
            key: 'number',
            display_name: 'Number',
            type: 'NUMBER',
            render_on_dashboard: true,
            render_in_csv: true,
        },
        {
            key: 'date',
            display_name: 'Date',
            type: 'DATE',
            render_on_dashboard: true,
            render_in_csv: true,
            filter_type: 'DATE_RANGE',
        },
        {
            key: 'boolean',
            display_name: 'Boolean',
            type: 'BOOLEAN',
            render_on_dashboard: true,
            render_in_csv: false,
            filter_type: 'BOOLEAN',
        },
        {
            key: 'string',
            display_name: 'String',
            type: 'STRING',
            render_on_dashboard: true,
            render_in_csv: true,
            filter_type: 'CONTAINS_TEXT',
        },
        {
            key: 'letter',
            display_name: 'Letter',
            type: 'STRING',
            render_on_dashboard: false,
            render_in_csv: true,
            filter_type: 'SELECT',
        },
    ],
    id_column_key: 'ref',
};

function renderReportViewWithRouter(history: ReturnType<createMemoryHistory>, match: ReturnType<givenUrl>['match']) {
    return render(
        <Router history={history}>
            <Route>
                {({ history, location }) =>
                    <ReportView history={history} location={location} match={match}/>
                }
            </Route>
        </Router>
    );
}

async function givenTestDataRendered() {
    const { match, history } = givenUrl({});

    const response = {
        data: {
            data: TEST_DATA,
            metadata: TEST_META
        }
    };

    const result = Promise.resolve(response);
    axiosGetMock.mockImplementation(() => result);

    const renderResult = renderReportViewWithRouter(history, match);

    await waitFor(async () => {
        // Meta has loaded when the title is updated
        expect(await screen.findByText('Test report')).toBeVisible();
        // Data is ready when the table renders a column header
        expect(await screen.findByTestId('ref--sort-link')).toBeDefined();
    });

    return {
        ...renderResult,
        location,
        match,
        history
    };
}

function extractUrls(history: typeof MemoryRouter.history) {
    return history.entries.map(e => `${e.pathname}${e.search}`);
}

let existingScrollTo;

beforeEach(() => {
    existingScrollTo = window.scrollTo;
    window.scrollTo = jest.fn();
});

afterEach(() => {
    window.scrollTo = existingScrollTo;
});

async function expectForAllCells<T extends Compar>(
    column: string,
    valueExtractor: (cell: HTMLTableCellElement) => T,
    test: (prev: T, curr: T) => void,
    identity: T
) {
    const table = await screen.findByTestId('data-table');
    const childNumber = TEST_META.columns.findIndex(m => m.key === column) + 1;

    [...table.querySelectorAll(`td:nth-child(${childNumber})`)].reduce(
        (previousValue, currentCell) => {
            const currentValue = valueExtractor(currentCell);
            test(previousValue, currentValue);
            return currentValue;
        },
        identity
    );
}

describe('Renders a report datatable', () => {
    it('Shows loading and error information to the user', async () => {
        const { match, history } = givenUrl({});

        const result = buildCompletablePromise();
        axiosGetMock.mockImplementation(() => result);

        const error = {
            response: { data: { error: 'An error occurred' } }
        };

        renderReportViewWithRouter(history, match);

        expect(await screen.findByText('Loading report')).toBeVisible();

        await act(() => result.reject(error));

        expect(await screen.queryByText('Loading report')).toBeNull();

        expect(await screen.findByText('Something went wrong')).toBeVisible();
        expect(await screen.findByText(error.response.data.error)).toBeVisible();
    });

    it('Can sort a numeric column', async () => {
        const { history } = await givenTestDataRendered();

        // ascending
        await act(async () => fireEvent.click(await screen.findByTestId('number--sort-link')));

        expect(extractUrls(history)).toContain('/report/COMP/test-report?sortKey=number');

        await expectForAllCells(
            'number',
            cell => parseInt(cell.innerHTML),
            (prev, curr) => expect(curr).toBeGreaterThanOrEqual(prev),
            0
        );

        // descending
        await act(async () => fireEvent.click(await screen.findByTestId('number--sort-link')));

        expect(extractUrls(history)).toContain('/report/COMP/test-report?sortKey=number&sortDirection=descending');

        await expectForAllCells(
            'number',
            cell => parseInt(cell.innerHTML),
            (prev, curr) => expect(curr).toBeLessThanOrEqual(prev),
            TEST_DATA.length
        );
    } );

    it('Can sort a date column', async () => {
        const { history } = await givenTestDataRendered();

        // ascending
        await act(async () => fireEvent.click(await screen.findByTestId('date--sort-link')));

        expect(extractUrls(history)).toContain('/report/COMP/test-report?sortKey=date');

        await expectForAllCells(
            'date',
            cell => dayjs(cell.innerHTML),
            (prev, curr) => expect(prev.isAfter(curr)).toBeFalsy(),
            dayjs('2023-01-01')
        );

        // descending
        await act(async () => fireEvent.click(await screen.findByTestId('date--sort-link')));

        expect(extractUrls(history)).toContain('/report/COMP/test-report?sortKey=date&sortDirection=descending');

        await expectForAllCells(
            'date',
            cell => dayjs(cell.innerHTML),
            (prev, curr) => expect(prev.isBefore(curr)).toBeFalsy(),
            dayjs('2023-05-01')
        );
    } );

    it('can filter exact string', async () => {
        const { history } = await givenTestDataRendered();

        await act(async () => {
            const filtersForm = await screen.findByTestId('filters-form');

            await userEvent.type(filtersForm.querySelector('[name="ref"]'), 'A-100099/23');

            fireEvent.click(await screen.findByText('Apply filters'));
        });

        expect(extractUrls(history)).toContain(
            '/report/COMP/test-report?ref=A-100099%2F23'
        );

        expect(await screen.findByTestId('showing-message')).toHaveTextContent(
            'Showing rows 1 to 1 of 1 matching result.' +
            ' 499 results were hidden because they don\'t match current filters.'
        );
    });

    it('displays a message no filters match', async () => {
        await givenTestDataRendered();

        await act(async () => {
            const filtersForm = await screen.findByTestId('filters-form');

            await userEvent.type(filtersForm.querySelector('[name="ref"]'), 'B-100099/23');

            fireEvent.click(await screen.findByText('Apply filters'));
        });

        expect(await screen.findByTestId('showing-message')).toHaveTextContent(
            'None of the 500 rows match your filters.'
        );
    });

    it('can filter by string partial matches', async () => {
        const { history } = await givenTestDataRendered();

        await act(async () => {
            const filtersForm = await screen.findByTestId('filters-form');

            // Should match "test phrase one" (72 times) and "another test one" (71 times)
            await userEvent.type(filtersForm.querySelector('[name="string"]'), 'test one');

            fireEvent.click(await screen.findByText('Apply filters'));
        });

        expect(extractUrls(history)).toContain(
            '/report/COMP/test-report?string=test%20one'
        );

        expect(await screen.findByTestId('showing-message')).toHaveTextContent(
            'Showing rows 1 to 50 of 143 matching results.' +
            ' 357 results were hidden because they don\'t match current filters.'
        );

        await expectForAllCells(
            'string',
            cell => cell,
            (_, curr) => {
                expect(curr).toHaveTextContent(/test/);
                expect(curr).toHaveTextContent(/one/);
            },
            null
        );
    });

    it('can filter by date', async () => {
        const { history } = await givenTestDataRendered();

        await act(async () => {
            const filtersForm = await screen.findByTestId('filters-form');

            await userEvent.type(filtersForm.querySelector('[name="date[from]"]'), '3 Apr 2023');
            await userEvent.type(filtersForm.querySelector('[name="date[to]"]'), '8/4/2023');

            fireEvent.click(await screen.findByText('Apply filters'));
        });

        expect(extractUrls(history)).toContain(
            '/report/COMP/test-report?date%5Bfrom%5D=3%20Apr%202023&date%5Bto%5D=8%2F4%2F2023'
        );

        expect(await screen.findByTestId('showing-message')).toHaveTextContent(
            'Showing rows 1 to 50 of 84 matching results.' +
            ' 416 results were hidden because they don\'t match current filters.'
        );

        await expectForAllCells(
            'date',
            cell => dayjs(cell.innerHTML),
            (_, curr) => {
                expect(curr.isBefore('2023-04-03')).toBeFalsy();
                expect(curr.isAfter('2023-04-08')).toBeFalsy();
            },
            null
        );
    });

    it('can apply the union of select and boolean filters',  async () => {
        const { history } = await givenTestDataRendered();

        await act(async () => {
            const filtersForm = await screen.findByTestId('filters-form');

            // Should match "test phrase one" (72 times) and "another test one" (71 times)
            await userEvent.selectOptions(filtersForm.querySelector('[name="letter"]'), 'A');
            await userEvent.click(filtersForm.querySelector('[for="boolean--yes"]'));

            fireEvent.click(await screen.findByText('Apply filters'));
        });

        expect(extractUrls(history)).toContain(
            '/report/COMP/test-report?boolean%5B%5D=yes&letter=A'
        );

        // 56 A's, of which half are also boolean = true
        expect(await screen.findByTestId('showing-message')).toHaveTextContent(
            'Showing rows 1 to 28 of 28 matching results.' +
            ' 472 results were hidden because they don\'t match current filters.'
        );

        await expectForAllCells(
            'letter',
            cell => cell,
            (_, curr) => {
                expect(curr).toHaveTextContent('A');
            },
            null
        );

        await expectForAllCells(
            'boolean',
            cell => cell,
            (_, curr) => {
                expect(curr).toHaveTextContent('Yes');
            },
            null
        );
    });
});
