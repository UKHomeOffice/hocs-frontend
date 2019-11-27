import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Submit from '../forms/submit.jsx';
import Dropdown from '../forms/dropdown.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';

const LinkButton = ({ label, endpoint, submitHandler }) => (
    <button
        type='submit'
        onClick={e => submitHandler(e, endpoint)}
        className='govuk-button--link govuk-link'
        formMethod='POST'
        formEncType='multipart/form-data'
        formAction={endpoint}>
        {label}
    </button>
);

LinkButton.propTypes = {
    label: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired
};

const SortDirection = {
    ASCENDING: 1,
    DESCENDING: -1
};

const ColumnRenderer = {
    CASE_LINK: 'caseLink',
    DATE: 'date',
    INDICATOR_BLUE: 'indicatorBlue',
    INDICATOR_RED: 'indicatorRed',
    WRAP_TEXT: 'wrapText'
};

const dataAdapters = {
    localDate: (value) => {
        var date = new Date(value);
        return date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    },
    indicator: (value, key) => value === 'YES' ? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace('Is ', '') : undefined
};

class WorkstackAllocate extends Component {

    constructor(props) {
        super(props);
        const { items, selectedCases = [], selectable, columns } = props;
        this.state = { selectable, items, selectedCases, filter: '', columns, sort: { column: undefined, order: SortDirection.ASCENDING } };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    doesFilterMatchData(filter, row, column) {
        const value = this.getCellValue(row, column);
        return value && value.toUpperCase && value.toUpperCase().indexOf(filter) !== -1;
    }

    getCellValue(row, column) {
        const value = row[column.dataValueKey] !== undefined ? row[column.dataValueKey] : row.data[column.dataValueKey];
        return this.applyDataAdapter(value, column);
    }

    applyDataAdapter(value, column) {
        if (column.dataAdapter) {
            const dataAdapter = dataAdapters[column.dataAdapter];

            if (dataAdapter) {
                return dataAdapter(value, column.dataValueKey);
            }

            throw new Error('Data Adapter not implemented: ' + column.dataAdapter);
        }

        return value;
    }

    applyFilter(filter, items, columns) {
        const { updateFormData } = this.props;
        const { selectedCases } = this.state;
        if (filter !== '') {
            const filterableColumns = columns.filter(column => {
                return column.isFilterable === true;
            });
            const filteredRows = items.filter(row => {
                return filterableColumns.map(column => this.doesFilterMatchData(filter, row, column)).some(matches => matches === true);
            });
            this.setState({ items: filteredRows, selectedCases: this.filterBySelected(filteredRows) });
            updateFormData({ selected_cases: this.filterBySelected(filteredRows) });
        } else {
            this.setState({ items, selectedCases });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.items != nextProps.items) {
            this.applyFilter(this.state.filter, nextProps.items, nextProps.columns);
        }
    }

    filterBySelected(selected) {
        const { selectedCases } = this.state;
        return selected
            .filter(({ uuid, caseUUID }) => selectedCases.includes(`${caseUUID}:${uuid}`))
            .map(({ uuid, caseUUID }) => `${caseUUID}:${uuid}`);
    }

    filter(e) {
        const filter = e.target.value ? e.target.value.toUpperCase() : '';
        this.setState(state => ({ ...state, filter }));
        this.applyFilter(filter, this.props.items, this.props.columns);
    }

    renderFilter() {
        return (
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-one-third'>
                    <div className='govuk-form-group filter-row'>
                        <legend id={'workstack-filter-legend'} className='govuk-fieldset__legend'>
                            <span className='govuk-fieldset__heading govuk-label--s'>Case Filter</span>
                        </legend>
                        <input className='govuk-input'
                            id='workstack-filter'
                            type='text'
                            name='workstack-filter'
                            onChange={this.filter.bind(this)}
                            onBlur={() => this.props.track('EVENT', { category: 'Workstack', action: 'Filter' })}
                        />
                    </div>
                </div>
            </div>
        );
    }

    setSort(selectedColumn) {
        this.setState((currentState) => {
            const { sort: { direction: currentDirection, column: currentColumn } } = currentState;
            let newDirection = SortDirection.ASCENDING;
            let newColumn = selectedColumn;

            if (selectedColumn === currentColumn) {
                if (currentDirection === SortDirection.ASCENDING) {
                    newDirection = SortDirection.DESCENDING;
                } else if (currentDirection === SortDirection.DESCENDING) {
                    newColumn = undefined;
                }
            }
            return {
                ...currentState,
                sort: {
                    column: newColumn,
                    direction: newDirection
                }
            };
        });
    }

    renderHeader(column) {
        const { column: sortColumn, direction } = this.state.sort;
        const sorted = sortColumn === column;
        return (
            <th onClick={() => this.setSort(column)}
                key={column.displayName}
                className={classNames(column.headerClassName, 'govuk-link', {
                    'sorted-ascending': sorted && direction === SortDirection.ASCENDING,
                    'sorted-descending': sorted && direction === SortDirection.DESCENDING
                })}>
                {column.renderer !== ColumnRenderer.INDICATOR_BLUE && column.renderer !== ColumnRenderer.INDICATOR_RED && column.displayName}
            </th>
        );
    }

    renderRow(item, columns) {
        const value = `${item.caseUUID}:${item.uuid}`;
        const checkboxKey = item.caseUUID + item.uuid;
        const handleChange = (e) => {
            const { selectedCases } = this.state;
            const selection = new Set(selectedCases);
            if (selection.has(e.target.value)) {
                selection.delete(e.target.value);
            } else {
                selection.add(e.target.value);
            }
            this.setState(state => ({ ...state, selectedCases: Array.from(selection) }));
            this.props.updateFormData({ selected_cases: Array.from(selection) });
        };
        return (
            <tr key={item.uuid} className='govuk-radios govuk-table__row'>
                {this.state.selectable && <td className='govuk-table__cell'>
                    <div className='govuk-checkboxes'>
                        <div key={checkboxKey} className='govuk-checkboxes__item'>
                            <input id={`selected_cases_${item.caseUUID}`}
                                type='checkbox'
                                name={'selected_cases[]'}
                                value={value}
                                checked={this.state.selectedCases.includes(value)}
                                onChange={handleChange.bind(this)}
                                className={'govuk-checkboxes__input'}
                            />
                            <label className='govuk-label govuk-checkboxes__label' htmlFor={`selected_cases_${item.caseUUID}`}></label>
                        </div>
                    </div>
                </td>}
                {columns && columns.map(column => this.renderDataCell(column, item))}
            </tr>
        );
    }

    renderDataCell(column, row) {
        const value = this.getCellValue(row, column);

        switch (column.renderer) {
            case ColumnRenderer.CASE_LINK:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>
                    <Link to={`/case/${row.caseUUID}/stage/${row.uuid}`} className='govuk-link govuk-!-margin-right-3'>{value}</Link>
                </td>;
            case ColumnRenderer.DATE:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
            case ColumnRenderer.INDICATOR_BLUE:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell indicator'>
                    {value && <span title={value} className='indicator-blue'>
                        {column.displayName.substring(0, 1)}
                    </span>}
                </td>;
            case ColumnRenderer.INDICATOR_RED:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell indicator'>
                    {value && <span title={value} className='indicator-red'>
                        {column.displayName.substring(0, 1)}
                    </span>}
                </td>;
            case ColumnRenderer.WRAP_TEXT:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell wrap-text'>{value}</td>;
            default:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
        }
    }

    renderTeamsDropdown() {
        const { teamMembers } = this.props;
        return (
            <Fragment>
                <Dropdown label='Allocate to a team member' name='selected_user' updateState={this.props.updateFormData} choices={teamMembers} />
                <Submit label='Allocate' />
            </Fragment>
        );
    }

    compareRows(a, b) {
        const { column: sortColumn } = this.state.sort;
        const aValue = sortColumn ? this.getCellValue(a, sortColumn) || '' : a.index;
        const bValue = sortColumn ? this.getCellValue(b, sortColumn) || '' : b.index;
        if (aValue > bValue) {
            return 1 * this.state.sort.direction;
        } else if (aValue < bValue) {
            return -1 * this.state.sort.direction;
        }
        return 0;
    }

    render() {
        const { isMounted, items, selectable, columns } = this.state;
        const { baseUrl, teamMembers, submitHandler, allocateToTeamEndpoint, allocateToWorkstackEndpoint, allocateToUserEndpoint } = this.props;

        return (
            <Fragment>
                {isMounted && this.renderFilter()}
                <br />
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <form action={baseUrl + allocateToTeamEndpoint} method='POST' onSubmit={e => submitHandler(e, baseUrl + allocateToTeamEndpoint)} encType='multipart/form-data'>
                            <fieldset className='govuk-fieldset'>
                                <div className='govuk-grid-row'>
                                    <div className='govuk-grid-column-full'>
                                        <div className='workstack'>
                                            <span className='govuk-hint' aria-live='polite'>
                                                {items.length} Items
                                            </span>
                                            <table className='govuk-table'>
                                                <thead className='govuk-table__head'>
                                                    <tr className='govuk-radios govuk-table__row'>
                                                        {selectable && <th className='govuk-table__header'>Select</th>}
                                                        {columns && columns.map(this.renderHeader.bind(this))}
                                                    </tr>
                                                </thead>
                                                <tbody className='govuk-table__body'>
                                                    {items && items
                                                        .map((item, index) => ({ ...item, index }))
                                                        .sort(this.compareRows.bind(this))
                                                        .map(item => this.renderRow(item, columns))}
                                                </tbody>
                                            </table>
                                            <span className='govuk-hint' aria-live='polite'>
                                                {items.length} Items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='govuk-grid-row'>
                                    <div className='govuk-grid-column-one-third'>
                                        <ul className='govuk-list'>
                                            <li>
                                                {allocateToUserEndpoint && LinkButton({ label: 'Allocate selected to me', endpoint: (baseUrl + allocateToUserEndpoint), submitHandler })}
                                            </li>
                                            <li>
                                                {allocateToWorkstackEndpoint && LinkButton({ label: 'Unallocate selected', endpoint: (baseUrl + allocateToWorkstackEndpoint), submitHandler })}
                                            </li>
                                        </ul>
                                        {teamMembers && this.renderTeamsDropdown()}
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

WorkstackAllocate.propTypes = {
    items: PropTypes.array.isRequired,
    columns: PropTypes.array,
    selectable: PropTypes.bool.isRequired,
    selectedCases: PropTypes.array,
    teamMembers: PropTypes.array,
    allocateToUserEndpoint: PropTypes.string,
    allocateToTeamEndpoint: PropTypes.string,
    allocateToWorkstackEndpoint: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired,
    track: PropTypes.func.isRequired
};

const WrappedWorkstackAllocate = props => (
    <ApplicationConsumer>
        {({ track }) => <WorkstackAllocate {...props} track={track} />}
    </ApplicationConsumer>
);

export default WrappedWorkstackAllocate;