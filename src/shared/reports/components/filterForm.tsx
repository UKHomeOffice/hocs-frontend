import type { ColumnMetadata, ReportRow } from './dataTable';
import React, { Component, FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DateRange } from './filters/dateRange';
import type { BooleanFilters } from './filters/boolean';
import type { ParsedQs } from 'qs';

export type FilterValue = string | DateRange | BooleanFilters

export type ParsedQsValue = undefined | string | string[] | ParsedQs | ParsedQs[]

export type Filters = Record<string, Filter<FilterValue, ParsedQsValue>>

export interface Filter<I extends FilterValue, Q extends ParsedQsValue> {
    Element: Component<FilterInputProps>,
    predicateBuilder: (key: string, filterValue: I) => ((row: ReportRow) => boolean)[],
    mapQueryToInternal: (query: Q) => I
    mapInternalToQuery: (internal: I) => Q
}

export type FilterType = 'BOOLEAN' | 'CONTAINS_TEXT' | 'DATE_RANGE' | 'EXACT_TEXT' | 'SELECT';

export interface FilterInputProps {
    column: ColumnMetadata
    value: FilterValue | undefined
    onChange: (newValue: FilterValue) => void
    data: ReportRow[]
}

function chunk<T>(arr: T[], n: number): T[][] {
    if (arr.length === 0) {
        return [];
    }

    return [arr.slice(0, n), ...chunk(arr.slice(n), n)];
}

interface FilterFormProps {
    columns: ColumnMetadata[]
    filterValues: Record<string, FilterValue>
    filters: Filters
    data: ReportRow[]
    onSubmit: (updatedValues: Record<string, FilterValue>) => void,
    clearFiltersUrl: string
}

export const FilterForm = ({ columns, filterValues, filters, data, onSubmit, clearFiltersUrl }: FilterFormProps) => {
    const [filterOptions, setFilterOptions] = useState<Record<string, FilterValue>>(filterValues);
    // Copy external url changes into internal state
    useEffect(() => {
        setFilterOptions(filterValues);
    }, [filterValues]);

    // internal state can then diverge as the user edits the form
    const setFilterOption = useCallback(
        (key: string, value: FilterValue) => {
            setFilterOptions((opts: Record<string, FilterValue>) => ({ ...opts, [key]: value }));
        },
        []
    );

    const filterColumns = columns.filter(column => column.filter_type != null && filters[column.key]);
    if(filterColumns.length === 0) {
        return null;
    }

    return <form
        className='decs-filters'
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onSubmit(filterOptions);
        }}
        data-testid={'filters-form'}
    >
        <fieldset className='govuk-fieldset'>
            <legend className='govuk-fieldset__legend govuk-fieldset__legend--m'>
                <h2 className="govuk-fieldset__heading">Filter report</h2>
            </legend>
            {chunk(filterColumns, 3).map((row, i) =>
                <div key={i} className='govuk-grid-row'>
                    {row.map(column => {
                        const FilterElement = filters[column.key].Element;

                        return <div className='govuk-grid-column-one-third' key={column.key}>
                            <FilterElement
                                key={column.key}
                                column={column}
                                value={filterOptions[column.key]}
                                onChange={(newValue) => setFilterOption(column.key, newValue)}
                                data={data}
                            />
                        </div>;
                    }
                    )}
                </div>
            )}
        </fieldset>
        <div className="govuk-button-group">
            <button className='govuk-button' type='submit'>Apply filters</button>
            <Link className='govuk-link' to={clearFiltersUrl}>Clear filters</Link>
        </div>
    </form>;
};

export function applyFilters(
    filters: Record<string, Filter<FilterValue, ParsedQsValue>>,
    appliedFilters: Record<string, FilterValue>,
    data: ReportRow[]
): ReportRow[] {
    const predicates: ((row: ReportRow) => boolean)[] =
        Object.entries(filters)
            .flatMap(([key, filter]) => {
                if (!appliedFilters[key]) {
                    return [];
                }

                return filter.predicateBuilder(key, appliedFilters[key]);
            });

    return data.filter(row => predicates.every(p => p(row)));
}
