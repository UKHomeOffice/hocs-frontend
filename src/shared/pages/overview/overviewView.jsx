import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import { Link, useHistory } from 'react-router-dom';

function DefaultColumnFilter({
    column: { filterValue, setFilter },
}) {
    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
            placeholder={'Search...'}
            className="govuk-input"
        />
    );
}

function CaseTypeFilter({
    column: { filterValue, setFilter },
}) {
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
            className="govuk-select"
        >
            <option value="">All</option>
            <option value="MIN">DCU Ministerial</option>
            <option value="TRO">DCU Treat Official</option>
            <option value="DTEN">DCU Number 10</option>
            <option value="MPAM">MPAM</option>
            <option value="MTS">MTS Case</option>
            <option value="FOI">FOI</option>
        </select>
    );
}

function Table({
    columns,
    data,
    fetchData,
    pageCount: controlledPageCount,
}) {

    const history = useHistory();

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        allColumns,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, sortBy, filters },
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: {
            pageIndex: 0,
            hiddenColumns: columns.map(column => {
                if (column.show === false) return column.accessor || column.id; })
        },
        manualPagination: true,
        manualSortBy: true,
        manualFilters: true,
        pageCount: controlledPageCount
    },
    useFilters,
    useSortBy,
    usePagination
    );

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy, filters });
    }, [fetchData, pageIndex, pageSize, sortBy, filters]);

    return (
        <>
            <h1 className="govuk-heading-xl">Overview</h1>

            <details className="govuk-details" data-module="govuk-details">
                <summary className="govuk-details__summary">
                    <span className="govuk-details__summary-text">
                      Show/Hide columns
                    </span>
                </summary>
                <div className="govuk-details__text">
                    <div className="govuk-checkboxes">
                        {allColumns.map(column => (
                            <div key={column.id} className="govuk-checkboxes__item">
                                <input className="govuk-checkboxes__input" type="checkbox" {...column.getToggleHiddenProps()}/>
                                <label
                                    className="govuk-label govuk-checkboxes__label"
                                    htmlFor=" {column.id}">
                                    {column.Header}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </details>
            <table {...getTableProps()} className="govuk-table overview">
                <thead className="govuk-table__head">
                    {headerGroups.map((headerGroup, i) => (
                        <tr key={i} {...headerGroup.getHeaderGroupProps()} className="govuk-table__row">
                            {headerGroup.headers.map((column, j) => (
                                <th key={j} {...column.getHeaderProps()} className="govuk-table__header">
                                    <div {...column.getSortByToggleProps()} style={{ cursor:'pointer', height: 30, display: 'flex', flexDirection: 'row' }} >
                                        {column.render('Header')}
                                        <div style={{ width: 20 }} >
                                            {column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}
                                        </div>
                                    </div>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="govuk-table__body">
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr key={i} {...row.getRowProps()} className="govuk-table__row" onClick={()=>  history.push('/case/' + row.original.caseUuid + '/stage/' +row.original.stageUuid)}>
                                {row.cells.map((cell, j) => {
                                    return <td key={j} {...cell.getCellProps()} className="govuk-table__cell">{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination govuk-body">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="govuk-button govuk-button--secondary">
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="govuk-button govuk-button--secondary">
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage} className="govuk-button govuk-button--secondary">
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="govuk-button govuk-button--secondary">
                    {'>>'}
                </button>{' '}
                <span>
          Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                {' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                    className="govuk-select"
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

const OverviewView = () => {

    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = React.useState(0);

    const fetchIdRef = React.useRef(0);

    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, filters }) => {
        // This will get called when the table needs new data

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current;

        const filter = filters && filters.length ? filters.map((item) => `${item.id}:${item.value}`).join(',') : null;
        const sort = sortBy && sortBy.length ? sortBy.map((item) => `${item.id}:${item.desc ? 'desc' : 'asc'}`).join(',') : null;
        const queryParams = { pageIndex, pageSize, filter, sort };
        const queryString = Object.keys(queryParams)
            .filter((x) => queryParams[x] !== undefined && queryParams[x] !== null)
            .map((x) => `${encodeURIComponent(x)}=${encodeURIComponent(queryParams[x])}`)
            .join('&');

        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
            axios.get('/api/overview?' + queryString)
                .then(response => {
                    setData(response.data.content);
                    setPageCount(response.data.totalPages);
                });
        }
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Reference',
                accessor: 'reference',
                // eslint-disable-next-line react/prop-types,react/display-name
                Cell: ({ row }) => (<Link to={{ pathname: '/case/' + row.original.caseUuid + '/stage/' +row.original.stageUuid }}>{row.original.reference}</Link>)
            },
            {
                Header: 'Case Type',
                accessor: 'caseType',
                Filter: CaseTypeFilter,
                filter: 'includes',
            },            {
                Header: 'Stage',
                accessor: 'stageType',
                show: false
            },
            {
                Header: 'Team',
                accessor: 'teamName'
            },
            {
                Header: 'Allocated To',
                accessor: 'allocatedUserEmail'
            },
            {
                Header: 'Owner',
                accessor: 'ownerEmail'
            },
            {
                Header: 'Created',
                accessor: 'created',
                show: false,
                disableFilters: true
            },
            {
                Header: 'Deadline',
                accessor: 'deadline',
                disableFilters: true
            },
            {
                Header: 'Days Until Deadline',
                accessor: 'daysUntilDeadline',
                show: false,
                disableFilters: true
            }

        ],
        []
    );

    return <Table columns={columns}
        data={data}
        fetchData={fetchData}
        pageCount={pageCount}/>;
};

OverviewView.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

DefaultColumnFilter.propTypes = {
    column: PropTypes.object.isRequired
};

CaseTypeFilter.propTypes = {
    column: PropTypes.object.isRequired
};

const WrappedOverview = (props) => (
    <ApplicationConsumer>
        {({ dispatch, track }) => (
            <OverviewView {...props} track={track} dispatch={dispatch} />
        )}
    </ApplicationConsumer>
);

export default WrappedOverview;
