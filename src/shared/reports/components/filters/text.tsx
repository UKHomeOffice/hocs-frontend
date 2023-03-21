import { Filter, FilterInputProps } from '../filterForm';
import { FormGroup } from './formGroup';
import React, { Component } from 'react';

const TextInput: Component<FilterInputProps> = ({ column, value, onChange }: FilterInputProps) =>
    <FormGroup label={column.display_name} id={column.key}>
        <input
            className='govuk-input'
            id={column.key}
            name={column.key}
            type='text'
            value={value as string}
            onChange={e => onChange(e.target.value)}
        />
    </FormGroup>;

export const exactTextFilter: Filter<string, string> = {
    Element: TextInput,
    predicateBuilder: (key, filterValue) => [
        (row) => row[key] === filterValue
    ],
    mapInternalToQuery: (query: string) => query,
    mapQueryToInternal: (internal: string) => internal,
};

export const containsTextFilter: Filter<string, string> = {
    Element: TextInput,
    predicateBuilder: (key, filterValue) => [
        (row) => row[key].toString().includes(filterValue)
    ],
    mapInternalToQuery: (query: string) => query,
    mapQueryToInternal: (internal: string) => internal,
};
