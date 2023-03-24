import React, { AriaAttributes, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Pagination } from './components/pagination';
import { DataTable, ReportMetadata, ReportRow } from './components/dataTable';
import {
    applyFilters,
    Filter,
    FilterForm,
    Filters,
    FilterType,
    FilterValue,
    ParsedQsValue
} from './components/filterForm';
import qs from 'qs';
import { booleanFilter } from './components/filters/boolean';
import { containsTextFilter, exactTextFilter } from './components/filters/text';
import { dateRangeFilter } from './components/filters/dateRange';
import { selectFilter } from './components/filters/select';

interface SortParams {
    sortKey?: string,
    sortDirection?: AriaAttributes['aria-sort'],
    page: number
}

const sortDefaults: SortParams = {
    sortDirection: 'ascending',
    page: 0
};

function isDefaultValue(key: string, value: string | number): boolean {
    return sortDefaults[key as keyof SortParams] === value;
}

type SearchParams = { sort: SortParams, appliedFilters: Record<string, FilterValue> }

function parseSearchParams(
    location: RouteComponentProps['location'],
    filters: Filters
): SearchParams {
    const search = location?.search?.slice(1) ?? ''; // strip leading '?'
    const { sortKey, sortDirection, page, ...rest } = qs.parse(search);
    const sort: SortParams = {
        sortKey: sortKey as string,
        sortDirection: sortDirection === 'descending' ? 'descending' : 'ascending',
        page: parseInt(page as string ?? '0')
    };

    const appliedFilters: Record<string, FilterValue> = Object.fromEntries(
        Object.entries(rest)
            .flatMap(([key, value]): [string, FilterValue][] =>
                filters[key] ? [[key, filters[key].mapQueryToInternal(value)]] : []
            )
    );

    return { sort, appliedFilters };
}

function sortData(
    data: ReportRow[],
    sortKey: SortParams['sortKey'],
    sortDirection: SortParams['sortDirection'],
): typeof data {
    if (!sortKey) {
        return data;
    }

    return data.sort((a, b) => {
        const a_val = a[sortKey];
        const b_val = b[sortKey];

        if (typeof a_val === 'number' && typeof b_val === 'number') {
            return sortDirection === 'ascending' ? a_val - b_val : b_val - a_val;
        }

        return sortDirection === 'ascending'
            ? a_val.toString().localeCompare(b_val.toString())
            : b_val.toString().localeCompare(a_val.toString());
    });
}

function buildSortLink(
    newKey: string,
    currentKey: SortParams['sortKey'],
    currentDirection: SortParams['sortDirection'],
    appliedFilters: Record<string, FilterValue>,
    filters: Filters,
    url: string
): string {
    if (newKey !== currentKey) {
        return buildFilterLink(appliedFilters, filters, newKey, 'ascending', 0, url);
    }
    if (currentDirection === 'ascending') {
        return buildFilterLink(appliedFilters, filters, newKey, 'descending', 0, url);
    } else {
        return buildFilterLink(appliedFilters, filters, undefined, undefined, 0, url);
    }
}

function buildFilterLink(
    appliedFilters: Record<string, FilterValue>,
    filters: Filters,
    sortKey: SortParams['sortKey'],
    sortDirection: SortParams['sortDirection'],
    page: SortParams['page'],
    url: string
): string {
    const queryParams = {
        ...Object.fromEntries(
            Object.entries(filters)
                .flatMap(([key, filter]) =>
                    appliedFilters[key]
                        ? [[key, filter.mapInternalToQuery(appliedFilters[key])]]
                        : []
                )
        ),
        ...(
            // Only include sort parameters that are set and not the default
            Object.fromEntries(
                Object
                    .entries({ sortKey, sortDirection, page })
                    .filter(([k, v]) => v && !isDefaultValue(k, v))
            )
        ),
    };

    return `${url}?${qs.stringify(queryParams, { arrayFormat: 'brackets' })}`;
}

function toCsvRow(data: (string | number | boolean)[]): string {
    return data
        .map(
            v => v.toString().match(/",/)
                ? `"${v.toString().replace(/"/g, '""')}"`
                : v
        )
        .join(',');
}

function downloadReportAsCSV(reportMeta: ReportMetadata, sortedData: ReportRow[]) {
    const csvData = [
        toCsvRow(reportMeta.columns.filter(c => c.render_in_csv).map(r => r.display_name)),
        ...sortedData.map(r => toCsvRow(Object.values(r)))
    ];

    const csvBlob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const objectURL = URL.createObjectURL(csvBlob);

    const a = document.createElement('a');
    a.download = `${reportMeta.slug}--${dayjs().format('YYYY-MM-DD--HH:mm')}.csv`;
    a.href = objectURL;
    a.click();

    URL.revokeObjectURL(objectURL);
}

function getFilterForType(type: FilterType): Filter<FilterValue, ParsedQsValue> {
    switch (type) {
        case 'BOOLEAN':
            return booleanFilter;
        case 'CONTAINS_TEXT':
            return containsTextFilter;
        case 'DATE_RANGE':
            return dateRangeFilter;
        case 'EXACT_TEXT':
            return exactTextFilter;
        case 'SELECT':
            return selectFilter;
    }
}

const ReportView = ({ match, location, history }: RouteComponentProps<{ caseType: string, reportSlug: string }>) => {
    const [reportData, setReportData] = useState<ReportRow[] | null>(null);
    const [filteredData, setFilteredData] = useState<ReportRow[] | null>(null);
    const [sortedData, setSortedData] = useState<ReportRow[] | null>(null);
    const [reportMeta, setReportMeta] = useState<ReportMetadata | null>(null);
    const [filters, setFilters] = useState<Filters>({});
    const [searchParams, setSearchParams] = useState<SearchParams>({ sort: sortDefaults, appliedFilters: {} });
    const [error, setError] = useState<string | null>(null);

    const { params: { caseType, reportSlug }, url } = match;

    const PAGE_SIZE = 50;

    useEffect(
        () => {
            axios.get(`/api/report/${caseType}/${reportSlug}`)
                .then(response => {
                    setReportData(response.data.data);
                    setReportMeta(response.data.metadata);
                })
                .catch(err => {
                    setError(
                        err?.response?.data?.error
                        ?? err?.message
                        ?? 'Requesting the report was not successful'
                    );
                });
        },
        []
    );

    useEffect(() => {
        if (reportMeta) {
            setFilters(
                Object.fromEntries(
                    reportMeta.columns
                        .filter(c => c.filter_type != undefined)
                        .map(c => [c.key, getFilterForType(c.filter_type)])
                )
            );
        }
    }, [reportMeta]);

    useEffect(
        () => {
            setSearchParams(parseSearchParams(location, filters));
        },
        [location, filters]
    );

    const { sort: { sortKey, sortDirection, page }, appliedFilters } = searchParams;

    useEffect(
        () => window.scrollTo(0, 0),
        [page, appliedFilters]
    );

    useEffect(
        () => {
            reportData && filters && setFilteredData(applyFilters(filters, appliedFilters, reportData));
        },
        [appliedFilters, reportData, filters]
    );

    useEffect(
        () => {
            filteredData && setSortedData(sortData([...filteredData], sortKey, sortDirection));
        },
        [sortKey, sortDirection, filteredData]
    );

    const sortLinkProvider = useCallback(
        (columnKey: string) =>
            buildSortLink(columnKey, sortKey, sortDirection, appliedFilters, filters, url),
        [sortKey, sortDirection, appliedFilters, url, filters]
    );

    const filterLinkProvider = useCallback(
        (filterValues: Record<string, FilterValue>) =>
            buildFilterLink(filterValues, filters, sortKey, sortDirection, 0, url),
        [sortKey, sortDirection, url, filters]
    );

    const handleDownload = useCallback(() => {
        if (!reportMeta || !sortedData) {
            return;
        }

        downloadReportAsCSV(reportMeta, sortedData);
    }, [reportMeta, sortedData]);

    if (error) {
        return <>
            <h1 className='govuk-heading-l'>Something went wrong</h1>
            <p className='govuk-body'>{error}</p>
            <Link to='/report' className='govuk-link'>Back to list of reports.</Link>
        </>;
    }

    if (!reportMeta || !sortedData) {
        return <h1 className='govuk-heading-l'>Loading report</h1>;
    }

    return <div>
        <Link to={'/report'} className='govuk-back-link'>Back to report list</Link>
        <div className='govuk-grid-row'>
            <div className='govuk-grid-column-two-thirds-from-desktop'>
                <h1 className='govuk-heading-l'>
                    {reportMeta.display_name
                        ? `${reportMeta.display_name} - ${caseType}`
                        : 'Loading'}
                </h1>
            </div>
            <div className='govuk-grid-column-one-third-from-desktop govuk-!-text-align-right'>
                <button className='govuk-button' onClick={() => handleDownload()}>Download CSV</button>
            </div>
        </div>
        <FilterForm
            columns={reportMeta.columns}
            filterValues={appliedFilters}
            filters={filters}
            data={reportData}
            onSubmit={(updatedValues) => history.push(filterLinkProvider(updatedValues))}
            clearFiltersUrl={filterLinkProvider({})}
        />
        <DataTable
            idColumnKey={reportMeta.id_column_key}
            columns={reportMeta.columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortLinkProvider={sortLinkProvider}
            sortedData={sortedData}
            page={page}
            pageSize={PAGE_SIZE}
        />
        <Pagination
            currentPage={page}
            pageSize={PAGE_SIZE}
            filteredRecords={sortedData.length}
            totalRecords={reportData.length}
            location={location}
        />
    </div>;
};

export default ReportView;
