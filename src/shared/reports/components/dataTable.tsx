import React, { AriaAttributes, useEffect, useRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import dayjs from 'dayjs';
import { FilterType } from './filterForm';

type ColumnType = 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'LINK';

export interface ColumnMetadata {
    key: string
    display_name: string
    type: ColumnType
    render_on_dashboard: boolean
    render_in_csv: boolean
    filter_type?: FilterType
    additional_fields?: Record<string, string>
}

export interface ReportMetadata {
    slug: string,
    display_name: string,
    columns: ColumnMetadata[],
    id_column_key: string,
}

export type ReportRow = Record<string, string | number | boolean>;

interface DataTableProps {
    idColumnKey: string
    columns: ColumnMetadata[]
    sortKey: string
    sortDirection: AriaAttributes['aria-sort']
    sortLinkProvider: (columnKey: string) => LinkProps['to']
    sortedData: ReportRow[]
    page: number
    pageSize: number
}

export const DataTable = ({
    columns,
    idColumnKey,
    sortKey,
    sortDirection,
    sortLinkProvider,
    sortedData,
    page,
    pageSize
}: DataTableProps) => {
    return <table className='govuk-table' data-testid={'data-table'}>
        <thead className='govuk-table__head'>
            <tr className='govuk-table__row'>
                {columns
                    .filter(column => column.render_on_dashboard)
                    .map(column =>
                        <th className='govuk-table__header'
                            key={column.key}
                            scope='col'
                            aria-sort={sortKey === column.key ? sortDirection : 'none'}
                        >
                            <Link
                                className='govuk-link sort-link'
                                to={sortLinkProvider(column.key)}
                                data-testid={`${column.key}--sort-link`}
                            >
                                {column.display_name}
                            </Link>
                        </th>
                    )
                }
            </tr>
        </thead>
        <tbody className='govuk-table__body'>
            {sortedData
                .slice(page * pageSize, (page + 1) * pageSize)
                .map(row => <tr className='govuk-table__row' key={row[idColumnKey].toString()}>
                    {columns.filter(column => column.render_on_dashboard)
                        .map(column =>
                            <DataCell
                                key={column.key}
                                type={column.type}
                                additional_metadata={column.additional_fields}
                                value={row[column.key]}
                                row={row}
                            />)
                    }
                </tr>)}
        </tbody>
    </table>;
};

interface DataCellProps {
    type: ColumnMetadata['type'],
    additional_metadata: ColumnMetadata['additional_fields']
    value: string | number | boolean
    row: ReportRow
}

const DataCell = ({ type, value, additional_metadata, row }: DataCellProps) => {
    const renderValue = () => {
        switch (true) {
            case type === 'BOOLEAN':
                return value ? 'Yes' : 'No';

            case type === 'DATE':
                return typeof value === 'string' ? dayjs(value).format('D MMM YYYY') : value;

            case type === 'LINK' && !!additional_metadata?.link_pattern: {
                return <Link
                    className='govuk-link'
                    to={additional_metadata.link_pattern.replace(
                        /\${([a-z0-9_]+)}/g,
                        (_, field) => {
                            return row[field]?.toString();
                        }
                    )}>{value}</Link>;
            }
            default:
                return value;
        }
    };

    return <td className='govuk-table__cell'>{renderValue()}</td>;
};
