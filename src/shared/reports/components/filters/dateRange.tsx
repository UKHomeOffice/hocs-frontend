import React, { ChangeEvent } from 'react';
import { Filter } from '../filterForm';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ColumnMetadata, ReportRow } from '../dataTable';
import { Fieldset } from './fieldset';

dayjs.extend(customParseFormat);

interface DateValue {
    date?: Date
    text: string
    error?: string
}

export type DateRange = { to?: DateValue, from?: DateValue };

type DateRangeQueryParams = { from?: string, to?: string };

const separators = ['-', ' ', '/'];
const days = ['DD', 'D'];
const months = ['MM', 'M', 'MMM', 'MMMM'];

const formats = separators
    .flatMap(sep => days.map(day => [sep, day]))
    .flatMap(([sep, day]) => months.map(mth => [sep, day, mth]))
    .flatMap(([sep, day, mth]) => [
        // Since accepting YYYY at start or end is awkward to specify in an array of strings, it's easier to
        // enumerate the three combinations of acceptable formats
        `${day}${sep}${mth}${sep}YYYY`,
        `${day}${sep}${mth}${sep}YY`,
        `YYYY${sep}${mth}${sep}${day}`,
    ]);

export function parseDate(label: string, dateString: string | undefined, notBefore?: Date): DateValue {
    if(!dateString) {
        return { text: '' };
    }

    const date = dayjs(dateString, formats, true);

    if (!date.isValid()) {
        return {
            text: dateString,
            error: `${label} is not a date. Enter a date or leave it blank`
        };
    }

    if(notBefore && date.isBefore(notBefore)) {
        return {
            text: dateString,
            error: 'Enter a to date that is after the from date'
        };
    }

    return {
        text: date.format('D MMM YYYY'),
        date: date.toDate()
    };
}

interface DateRangeFieldsetProps {
    column: ColumnMetadata
    value: DateRange
    onChange: (range: DateRange) => void
}

export const DateRangeFieldset = ({ column, value = { from: { text: '' }, to: { text: '' } }, onChange }: DateRangeFieldsetProps) => {
    const handleChange = (key: 'from' | 'to') => (e: ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...(value ?? {}),
            [key]: { text: e.target.value }
        });
    };

    const errors = [
        ...(value?.from.error ? [value.from.error] : []),
        ...(value?.to.error ? [value.to.error] : [])
    ];

    return <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
        <Fieldset
            legend={column.display_name}
            id={column.key}
            hint='Enter dates as e.g. 17/6/2022, 17 Jun 2022, 2022-06-17. From or to can be empty.'
            error={errors.join(', ')}
        >
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-one-half'>
                    <label className='govuk-label' htmlFor={`${(column.key)}--from`}>From date</label>
                    <input
                        name={`${(column.key)}[from]`}
                        id={`${(column.key)}--from`}
                        className={`govuk-input${value?.from.error ? ' govuk-input--error' : ''}`}
                        value={value?.from.text ?? ''}
                        type='text'
                        onChange={handleChange('from')}
                    />
                </div>
                <div className='govuk-grid-column-one-half'>
                    <label className='govuk-label' htmlFor={`${(column.key)}--to`}>To date</label>
                    <input
                        name={`${(column.key)}[to]`}
                        id={`${(column.key)}--to`}
                        className={`govuk-input${value?.to.error ? ' govuk-input--error' : ''}`}
                        value={value?.to.text ?? ''}
                        type='text'
                        onChange={handleChange('to')}
                    />
                </div>
            </div>
        </Fieldset>
    </div>;
};

const stripEmptyOrUndefined = obj => Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != undefined && v !== '')
);

export const dateRangeFilter: Filter<DateRange, DateRangeQueryParams> = {
    Element: DateRangeFieldset,
    predicateBuilder: (key, filterValue) => [
        ...(filterValue?.from.date ? [(row: ReportRow) => !dayjs(row[key] as string).isBefore(filterValue.from.date)] : []),
        ...(filterValue?.to.date ? [(row: ReportRow) => !dayjs(row[key] as string).isAfter(filterValue.to.date)] : []),
    ],
    mapQueryToInternal: ({ from: fromString, to: toString }) => {
        const from = parseDate('From date', fromString);
        const to = parseDate('To date', toString, from?.date);
        return { from, to };
    },
    mapInternalToQuery: ({ from, to }) =>
        stripEmptyOrUndefined({
            from: from?.date ? dayjs(from.date).format('D MMM YYYY') : from?.text,
            to: to?.date ? dayjs(to.date).format('D MMM YYYY') : to?.text,
        })
};
