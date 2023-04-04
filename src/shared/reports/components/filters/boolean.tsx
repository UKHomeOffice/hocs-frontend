import React, { ChangeEvent } from 'react';
import { ColumnMetadata, ReportRow } from '../dataTable';
import { Fieldset } from './fieldset';
import { Filter } from '../filterForm';

export interface BooleanFilters { yes: boolean, no: boolean }

export interface BooleanFieldsetProps {
    column: ColumnMetadata
    value: BooleanFilters
    onChange: (value: BooleanFilters) => void
}

export const BooleanFieldset = ({ column, value, onChange }: BooleanFieldsetProps) => {
    const handleChange = (key: 'yes' | 'no') => (e: ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...(value ?? {}),
            [key]: e.target.checked
        });
    };

    return <Fieldset legend={column.display_name} id={column.key}>
        <div className='govuk-checkboxes govuk-checkboxes--small'>
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-one-third'>
                    <div className='govuk-checkboxes__item'>
                        <input
                            name={`${column.key}[]`}
                            id={`${column.key}--yes`}
                            className={'govuk-checkboxes__input'}
                            checked={value?.yes ?? false}
                            value={'yes'}
                            type='checkbox'
                            onChange={handleChange('yes')}
                        />
                        <label className='govuk-label govuk-checkboxes__label' htmlFor={`${column.key}--yes`}>Yes</label>
                    </div>
                </div>
                <div className='govuk-grid-column-one-third'>
                    <div className='govuk-checkboxes__item'>
                        <input
                            name={`${column.key}[]`}
                            id={`${column.key}--no`}
                            className={'govuk-checkboxes__input'}
                            checked={value?.no ?? false}
                            value={'no'}
                            type='checkbox'
                            onChange={handleChange('no')}
                        />
                        <label className='govuk-label govuk-checkboxes__label' htmlFor={`${column.key}--no`}>No</label>
                    </div>
                </div>
            </div>
        </div>
    </Fieldset>;
};

export const booleanFilter: Filter<BooleanFilters, ('yes'|'no')[]> = {
    Element: BooleanFieldset,
    predicateBuilder: (key, filterValue) => {
        if(!filterValue?.yes && !filterValue?.no) {
            return [];
        }

        return [
            (row: ReportRow) =>
                (filterValue.yes && row[key] === true)
                || (filterValue.no && row[key] === false)
        ];
    },
    mapQueryToInternal: query => ({
        yes: query?.includes('yes') ?? false,
        no: query?.includes('no') ?? false,
    }),
    mapInternalToQuery: internal => [
        ...(internal.yes ? ['yes'] : []),
        ...(internal.no ? ['no'] : []),
    ]
};
