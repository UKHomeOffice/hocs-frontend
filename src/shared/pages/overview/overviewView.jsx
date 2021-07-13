import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer, Context } from '../../contexts/application.jsx';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useFilters, useAsyncDebounce } from 'react-table';
import { Link, useHistory } from 'react-router-dom';
import 'regenerator-runtime/runtime'; //https://github.com/tannerlinsley/react-table/issues/2071#issuecomment-679999096
import { updateApiStatus } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';

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
    permittedCaseTypes
}) {
    const options = React.useMemo(() => {
        const options = new Set();
        permittedCaseTypes.forEach(pc => {
            options.add(pc);
        });
        return [...options.values()];
    }, [permittedCaseTypes]);

    return (
        <select
            className="govuk-select"
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function Table({
    columns,
    data,
    fetchData,
    pageCount: controlledPageCount,
    permittedCaseTypes
}) {

    const history = useHistory();

    const defaultColumn = React.useMemo(
        () => ({
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
        pageCount: controlledPageCount,
        permittedCaseTypes
    },
    useFilters,
    useSortBy,
    usePagination
    );

    const fetchDataDebounced = useAsyncDebounce(fetchData, 500);

    React.useEffect(() => {
        fetchDataDebounced({ pageIndex, pageSize, sortBy, filters });
    }, [fetchDataDebounced, pageIndex, pageSize, sortBy, filters]);

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
                                    <div>
                                        {column.canGroupBy ? (
                                            <span {...column.getGroupByToggleProps()}>
                                                {column.isGrouped ? '🛑 ' : '👊 '}
                                            </span>
                                        ) : null}
                                        <span {...column.getSortByToggleProps()}>
                                            {column.render('Header')}
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
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

    const { dispatch } = useContext(Context);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [permittedCaseTypes, setPermittedCaseTypes] = React.useState([]);

    const fetchIdRef = React.useRef(0);

    useEffect(() => {
        axios.get('/api/overview/caseTypes')
            .then(response => {
                setPermittedCaseTypes(response.data);
            })
            .catch(() => {
                dispatch(updateApiStatus(status.REQUEST_OVERVIEW_PERMITTED_CASES_DATA_FAILURE));
            });
    }, []);

    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, filters }) => {
        const fetchId = ++fetchIdRef.current;
        const filter = filters && filters.length ? filters.map((item) => `${item.id}:${item.value}`).join(',') : null;
        const sort = sortBy && sortBy.length ? sortBy.map((item) => `${item.id}:${item.desc ? 'desc' : 'asc'}`).join(',') : null;
        const queryParams = { pageIndex, pageSize, filter, sort };
        const queryString = Object.keys(queryParams)
            .filter((x) => queryParams[x] !== undefined && queryParams[x] !== null)
            .map((x) => `${encodeURIComponent(x)}=${encodeURIComponent(queryParams[x])}`)
            .join('&');
        if (fetchId === fetchIdRef.current) {
            axios.get('/api/overview?' + queryString)
                .then(response => {
                    setData(response.data.content);
                    setPageCount(response.data.totalPages);
                })
                .catch(() => {
                    dispatch(updateApiStatus(status.REQUEST_OVERVIEW_DATA_FAILURE));
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
            },
            {
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
                accessor: 'allocatedUsername'
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
                Header: 'Age',
                accessor: 'age',
                show: false,
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
        pageCount={pageCount}
        permittedCaseTypes={permittedCaseTypes}
    />;
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
    column: PropTypes.object.isRequired,
    permittedCaseTypes: PropTypes.array.isRequired
};

const WrappedOverview = (props) => (
    <ApplicationConsumer>
        {({ dispatch, track }) => (
            <OverviewView {...props} track={track} dispatch={dispatch} />
        )}
    </ApplicationConsumer>
);

export default WrappedOverview;
