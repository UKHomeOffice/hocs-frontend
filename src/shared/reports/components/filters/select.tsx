import { ColumnMetadata, ReportRow } from '../dataTable';
import React, { Component, useEffect, useState } from 'react';
import { Filter, FilterInputProps } from '../filterForm';
import { FormGroup } from './formGroup';

interface SelectProps {
    column: ColumnMetadata,
    value: string | undefined
    onChange: (newValue: string) => void
    data: ReportRow[]
}

const Select = ({ column, data, value, onChange }: SelectProps) => {
    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
        const set = data.reduce(
            (acc, row) => acc.add(row[column.key].toString()),
            new Set<string>()
        );
        const options: string[] = [];
        set.forEach(opt => options.push(opt));
        options.sort();

        setOptions(options);
    }, [data]);

    return <select
        className='govuk-select'
        id={column.key}
        name={column.key}
        value={value}
        onChange={e => onChange(e.target.value)}
    >
        <option value=''>
            Don&apos;t filter by {column.display_name.toLocaleLowerCase()}
        </option>
        {[...options].map(option =>
            <option
                key={option.toString()}
                value={option.toString()}
            >
                {option.toString()}
            </option>
        )}
    </select>;
};

const SelectFilterInput: Component<FilterInputProps> = ({ column, value, onChange, data }: FilterInputProps) =>
    <FormGroup label={column.display_name} id={column.key}>
        <Select column={column} value={value} onChange={onChange} data={data} />
    </FormGroup>;

export const selectFilter: Filter<string, string> = {
    Element: SelectFilterInput,
    predicateBuilder: (key, filterValue) => [
        (row) => row[key] === filterValue
    ],
    mapInternalToQuery: (query: string) => query,
    mapQueryToInternal: (internal: string) => internal,
};

