import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Submit from '../forms/submit.jsx';
import Dropdown from '../forms/dropdown.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import deepEqual from 'deep-equal';
import Tags from './workstack-tag.jsx';

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
    CORRESPONDENT_WITH_CASE_LINK: 'correspondentWithCaseLink',
    DATE: 'date',
    DATE_WARNING: 'dateWarning',
    DATE_RAW: 'dateRAW',
    DUE_DATE_WARNING: 'dueDateWarning',
    INDICATOR_BLUE: 'indicatorBlue',
    INDICATOR_GREEN: 'indicatorGreen',
    INDICATOR_RED: 'indicatorRed',
    WRAP_TEXT: 'wrapText',
    TRUNCATE_TEXT: 'truncateText',
    CONTRIBUTIONS_WARNING: 'contributionsWarning',
    MP_WITH_OWNER: 'mpWithOwner'
};

const ColumnSortStrategy = {
    FLOAT_TYPE: 'floatTypeStrategy',
    CORRESPONDENT_TYPE: 'correspondentTypeStrategy'
};

const dataAdapters = {
    primaryCorrespondent: (value, key, row) => {
        if (row.primaryCorrespondent) {
            return row.primaryCorrespondent[key];
        }
        return '';
    },
    localDate: (value) => {
        var date = new Date(value);
        if (isNaN(date) || value == null)
            return '';
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    },
    indicator: (value, key) => value && value.toUpperCase() === 'YES' ? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace('Is ', '') : undefined
};

class WorkstackAllocate extends Component {

    constructor(props) {
        super(props);
        const { items, selectedCases = [], selectable, columns } = props;
        this.state = {
            selectable,
            items,
            selectedCases,
            filter: '',
            columns,
            sort: { column: undefined, order: SortDirection.ASCENDING }
        };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    doesFilterMatchData(filter, row, column) {
        let value = this.getCellValue(row, column);

        if (value && Object.keys(value).length !== 0 && value.constructor === Object) {
            value = Object.values(value).join('');
        }

        return value && value.toUpperCase && value.toUpperCase().indexOf(filter) !== -1;
    }

    getCellValue(row, column) {
        const dataValueKeys = column.dataValueKey;

        if (dataValueKeys === undefined) {
            throw new Error('No data value key was specified');
        }

        const splitDataValueKeys = dataValueKeys.split(',');

        for (const dataValue of splitDataValueKeys) {
            let value = undefined;

            if (row[dataValue] !== undefined) {
                value = row[dataValue];
            } else if (row.data !== undefined) {
                value = row.data[dataValue];
            }

            if (value !== undefined) {
                return this.applyDataAdapter(value, column.dataAdapter, dataValue, row);
            }
        }

        return this.applyDataAdapter(undefined, column.dataAdapter, dataValueKeys, row);
    }

    getDataValue(row, dataValueKey) {
        if (dataValueKey === undefined) {
            throw new Error('No data value key was specified');
        }

        const splitDataValueKeys = dataValueKey.split(',');

        let value = undefined;

        for (const dataValue of splitDataValueKeys) {
            if (row[dataValue] !== undefined) {
                value = row[dataValue];
            } else if (row.data !== undefined) {
                value = row.data[dataValue];
            }

            if (value !== undefined) {
                break;
            }
        }

        return value;
    }

    getPrimaryCorrespondentDataValue(row, dataValueKey) {
        if (dataValueKey === undefined) {
            throw new Error('No data value key was specified');
        }
        return row.primaryCorrespondent[dataValueKey];
    }

    applyDataAdapter(value, colDataAdapter, dataValueKey, row) {
        if (colDataAdapter) {
            const dataAdapter = dataAdapters[colDataAdapter];

            if (dataAdapter) {
                return dataAdapter(value, dataValueKey, row);
            }

            throw new Error('Data Adapter not implemented: ' + colDataAdapter);
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

    componentDidUpdate(prevProps) {
        if (!deepEqual(prevProps.items, this.props.items)) {
            this.applyFilter(this.state.filter, this.props.items, this.props.columns);
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
        if (column.sortStrategy === 'noSort') {
            return (
                <th className='govuk-table__header' key={column.displayName}>
                    {column.renderer !== ColumnRenderer.INDICATOR_BLUE && column.renderer !== ColumnRenderer.INDICATOR_GREEN && column.renderer !== ColumnRenderer.INDICATOR_RED && column.displayName}
                </th>
            );
        } else {
            const { column: sortColumn, direction } = this.state.sort;
            const sorted = sortColumn === column;

            return (
                <th onClick={() => this.setSort(column)}
                    key={column.displayName}
                    className={classNames(column.headerClassName, 'govuk-link', {
                        'sorted-ascending': sorted && direction === SortDirection.ASCENDING,
                        'sorted-descending': sorted && direction === SortDirection.DESCENDING
                    })}>
                    {column.renderer !== ColumnRenderer.INDICATOR_BLUE && column.renderer !== ColumnRenderer.INDICATOR_GREEN && column.renderer !== ColumnRenderer.INDICATOR_RED && column.displayName}
                </th>
            );
        }
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
                            <label className='govuk-label govuk-checkboxes__label'
                                htmlFor={`selected_cases_${item.caseUUID}`}>
                                <span className='govuk-visually-hidden'>{item.caseReference}</span>
                            </label>
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
                    <Link to={`/case/${row.caseUUID}/stage/${row.uuid}`}
                        className='govuk-link govuk-!-margin-right-3'>{value}</Link>
                </td>;
            case ColumnRenderer.CORRESPONDENT_WITH_CASE_LINK:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>
                    {
                        value.primaryCorrespondentFullName &&
                        <span className='govuk-!-font-weight-bold'>{value.primaryCorrespondentFullName}<br/></span>
                    }
                    <Tags row={row}/>
                    <Link to={`/case/${row.caseUUID}/stage/${row.uuid}`}
                        className='govuk-link govuk-!-margin-right-3'>{value.caseReference}</Link>
                </td>;
            case ColumnRenderer.MP_WITH_OWNER:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>
                    {
                        <strong>{value.mp}</strong>
                    }
                    {
                        <div>{value.owner}</div>
                    }
                </td>;
            case ColumnRenderer.DATE:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
            case ColumnRenderer.DATE_WARNING:
                if (row.deadlineWarning) {
                    if (new Date(row.deadlineWarning) < new Date()) {
                        return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell date-warning'>
                            <span>{value}</span>
                        </td>;
                    }
                }
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
            case ColumnRenderer.DATE_RAW: { // date, with Red-Amber-White highlighting
                let rowClasses = 'govuk-table__cell date-nowarning';
                if (row.deadlineWarning) {
                    const date = new Date();
                    if (new Date(row.deadline) < new Date(date.getFullYear(), date.getMonth(), date.getDate())) {
                        rowClasses = 'govuk-table__cell date-warning';
                    } else if (new Date(row.deadlineWarning) < date) {
                        rowClasses = 'govuk-table__cell date-advisory';
                    }
                }
                return <td key={row.uuid + column.dataValueKey} className={rowClasses}>
                    <span>{value}</span>
                </td>;
            }
            case ColumnRenderer.DUE_DATE_WARNING:
                if (row.dueContribution && new Date(row.dueContribution) <= new Date()) {
                    return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell date-warning'>
                        <span>{value}</span>
                    </td>;
                }
                if (row.data && row.data.DueDate) {
                    if (new Date(row.data.DueDate) <= new Date()) {
                        return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell date-warning'>
                            <span>{value}</span>
                        </td>;
                    }
                }
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
            case ColumnRenderer.INDICATOR_BLUE:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell indicator'>
                    {value && <span title={value} className='indicator-blue'>
                        {column.displayName.substring(0, 1)}
                    </span>}
                </td>;
            case ColumnRenderer.INDICATOR_GREEN:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell indicator'>
                    {value && <span title={value} className='indicator-green'>
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
            case ColumnRenderer.TRUNCATE_TEXT:
                return <td key={row.uuid + column.dataValueKey}
                    className='govuk-table__cell govuk-table__cell--truncated' title={value}>{value}</td>;
            case ColumnRenderer.CONTRIBUTIONS_WARNING:
                if (row.dueContribution && new Date(row.dueContribution) < new Date()) {
                    return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell indicator'>
                        {value && <span title={value} className='indicator-red'>
                            {value}
                        </span>}
                    </td>;
                }
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
            default:
                return <td key={row.uuid + column.dataValueKey} className='govuk-table__cell'>{value}</td>;
        }
    }

    renderTeamsDropdown() {
        const { teamMembers } = this.props;
        return (
            <Fragment>
                <Dropdown label='Allocate to a team member' name='selected_user' updateState={this.props.updateFormData}
                    choices={teamMembers}/>
                <Submit label='Allocate' name='allocate_to_team_member' callback={this.props.updateFormData}/>
            </Fragment>
        );
    }

    renderMoveToAnotherTeamDropdown() {
        const { moveTeamOptions } = this.props;

        return (
            <Fragment>
                <Dropdown label='Move to another team' name='selected_team' updateState={this.props.updateFormData}
                    choices={moveTeamOptions}/>
                <Submit label='Move to team' name='move_team' callback={this.props.updateFormData}/>
            </Fragment>
        );
    }

    renderTakeNextCaseButton() {
        const { baseUrl, submitHandler } = this.props;
        const stageTypes = [
            'MPAM_DRAFT',
            'MPAM_DRAFT_ONHOLD',
            'MPAM_DRAFT_ESCALATE',
            'MPAM_DRAFT_REQUESTED_CONTRIBUTION',
            'MPAM_TRIAGE',
            'MPAM_TRIAGE_ON_HOLD',
            'MPAM_TRIAGE_ESCALATE',
            'MPAM_TRIAGE_REQUESTED_CONTRIBUTION',
            'MPAM_DISPATCH'
        ];

        if (this.props.items[0] !== undefined && stageTypes.includes(this.props.items[0].stageType)) {
            return (
                <li>
                    {LinkButton({ label: 'Take next case', endpoint: (baseUrl + '/allocate/user/next'), submitHandler })}
                </li>
            );
        }
    }

    compareRows(a, b) {
        const { column: sortColumn } = this.state.sort;
        if (sortColumn == undefined) {
            return this.defaultSortStrategy(a, b, sortColumn);
        } else {
            switch (sortColumn.sortStrategy) {
                case ColumnSortStrategy.FLOAT_TYPE:
                    return this.floatSortStrategy(a, b, sortColumn);
                case ColumnSortStrategy.CORRESPONDENT_TYPE:
                    return this.primaryCorrespondentSortStrategy(a, b, sortColumn);
                default:
                    return this.defaultSortStrategy(a, b, sortColumn);
            }
        }

    }

    floatSortStrategy(a, b, sortColumn) {
        const aValue = sortColumn ? (this.getDataValue(a, sortColumn.dataValueKey) || '').toUpperCase() : a.index;
        const bValue = sortColumn ? (this.getDataValue(b, sortColumn.dataValueKey) || '').toUpperCase() : b.index;

        const aFloat = parseFloat(aValue);
        const bFloat = parseFloat(bValue);
        if (aFloat > bFloat) {
            return 1 * this.state.sort.direction;
        } else if (aFloat < bFloat) {
            return -1 * this.state.sort.direction;
        }
        return 0;
    }

    primaryCorrespondentSortStrategy(a, b, sortColumn) {
        const aValue = sortColumn ? (this.getPrimaryCorrespondentDataValue(a, sortColumn.dataValueKey) || '').toUpperCase() : a.index;
        const bValue = sortColumn ? (this.getPrimaryCorrespondentDataValue(b, sortColumn.dataValueKey) || '').toUpperCase() : b.index;
        return this.sortStringValues(aValue, bValue);
    }

    defaultSortStrategy(a, b, sortColumn) {
        const aValue = sortColumn ? (this.getDataValue(a, sortColumn.dataValueKey) || '').toUpperCase() : a.index;
        const bValue = sortColumn ? (this.getDataValue(b, sortColumn.dataValueKey) || '').toUpperCase() : b.index;
        return this.sortStringValues(aValue, bValue);
    }

    sortStringValues(aValue, bValue) {
        if (aValue > bValue) {
            return 1 * this.state.sort.direction;
        } else if (aValue < bValue) {
            return -1 * this.state.sort.direction;
        }
        return 0;
    }

    render() {
        const { isMounted, items, selectable, columns } = this.state;
        const {
            baseUrl,
            teamMembers,
            moveTeamOptions,
            submitHandler,
            allocateToTeamEndpoint,
            allocateToWorkstackEndpoint,
            allocateToUserEndpoint
        } = this.props;
        return (
            <Fragment>
                {isMounted && this.renderFilter()}
                <br/>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <form action={baseUrl + allocateToTeamEndpoint} method='POST'
                            onSubmit={e => submitHandler(e, baseUrl + allocateToTeamEndpoint)}
                            encType='multipart/form-data'>
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
                                                {allocateToUserEndpoint && LinkButton({
                                                    label: 'Allocate selected to me',
                                                    endpoint: (baseUrl + allocateToUserEndpoint),
                                                    submitHandler
                                                })}
                                            </li>
                                            <li>
                                                {allocateToWorkstackEndpoint && LinkButton({
                                                    label: 'Unallocate selected',
                                                    endpoint: (baseUrl + allocateToWorkstackEndpoint),
                                                    submitHandler
                                                })}
                                            </li>
                                            {this.renderTakeNextCaseButton()}
                                        </ul>
                                        {teamMembers && this.renderTeamsDropdown()}
                                        {moveTeamOptions && moveTeamOptions.length > 0 && this.renderMoveToAnotherTeamDropdown()}
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
    moveTeamOptions: PropTypes.array,
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
        {({ track }) => <WorkstackAllocate {...props} track={track}/>}
    </ApplicationConsumer>
);

export default WrappedWorkstackAllocate;
