import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Submit from '../forms/submit.jsx';
import Dropdown from '../forms/dropdown.jsx';
import { Link } from 'react-router-dom';

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

export default class WorkstackAllocate extends Component {

    constructor(props) {
        super(props);
        const { items, selectedCases = [] } = props;
        this.state = { items, selectedCases, filter: '' };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    applyFilter(filter, items) {
        const { updateFormData } = this.props;
        const { selectedCases } = this.state;
        if (filter !== '') {
            const filtered = items.filter(r => {
                return (r.caseReference && r.caseReference.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedUserDisplay && r.assignedUserDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedTeamDisplay && r.assignedTeamDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.deadlineDisplay && r.deadlineDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.stageTypeDisplay && r.stageTypeDisplay.toUpperCase().indexOf(filter) !== -1);
            });
            this.setState({ items: filtered, selectedCases: this.filterBySelected(filtered) });
            updateFormData({ selected_cases: this.filterBySelected(filtered) });
        } else {
            this.setState({ items, selectedCases });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.items != nextProps.items) {
            this.applyFilter(this.state.filter, nextProps.items);
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
        this.applyFilter(filter, this.props.items);
    }

    renderFilter() {
        return (
            <div className='govuk-grid-row'>
                <div className='govuk-grid-column-full'>
                    <div className='govuk-form-group filter-row'>
                        <legend id={'workstack-filter-legend'} className='govuk-fieldset__legend'>
                            <span className='govuk-fieldset__heading govuk-label--s'>Case Filter</span>
                        </legend>
                        <input className='govuk-input govuk-!-width-one-third'
                            id='workstack-filter'
                            type='text'
                            name='workstack-filter'
                            onChange={this.filter.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderRow({ uuid, caseUUID, caseReference, stageTypeDisplay, assignedUserDisplay, assignedTeamDisplay, deadlineDisplay }, key) {
        const value = `${caseUUID}:${uuid}`;
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
            <tr key={uuid} className='govuk-radios govuk-table__row'>
                <td className='govuk-table__cell'>
                    <div className='govuk-checkboxes'>
                        <div key={key} className='govuk-checkboxes__item'>
                            <input id={`selected_cases_${caseUUID}`}
                                type='checkbox'
                                name={'selected_cases[]'}
                                value={value}
                                checked={this.state.selectedCases.includes(value)}
                                onChange={handleChange.bind(this)}
                                className={'govuk-checkboxes__input'}
                            />
                            <label className='govuk-label govuk-checkboxes__label' htmlFor={caseUUID}></label>
                        </div>
                    </div>
                </td>
                <td className='govuk-table__cell'>
                    <Link to={`/case/${caseUUID}/stage/${uuid}`} className='govuk-link govuk-!-margin-right-3'>{caseReference}</Link>
                </td>
                <td className='govuk-table__cell'>{stageTypeDisplay}</td>
                <td className='govuk-table__cell'>{assignedUserDisplay}</td>
                <td className='govuk-table__cell'>{assignedTeamDisplay}</td>
                <td className='govuk-table__cell'>{deadlineDisplay}</td>
            </tr>
        );
    }

    renderTeamsDropdown() {
        const { teamMembers } = this.props;
        return (
            <Fragment>
                <Dropdown label='Allocate cases to a user' name='selected_user' updateState={() => { }} choices={teamMembers} />
                <Submit label='Allocate' />
            </Fragment>
        );
    }

    render() {
        const { isMounted, items } = this.state;
        const { baseUrl, teamMembers, submitHandler, allocateToTeamEndpoint, allocateToWorkstackEndpoint, allocateToUserEndpoint } = this.props;

        return (
            <Fragment>
                {isMounted && this.renderFilter()}
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <form action={baseUrl + allocateToTeamEndpoint} method='POST' onSubmit={e => submitHandler(e, baseUrl + allocateToTeamEndpoint)} encType='multipart/form-data'>
                            <fieldset className='govuk-fieldset'>
                                <div className='govuk-grid-row'>
                                    <div className='govuk-grid-column-full'>
                                        <div className='workstack'>
                                            <table className='govuk-table'>
                                                <thead className='govuk-table__head'>
                                                    <tr className='govuk-radios govuk-table__row'>
                                                        <th className='govuk-table__header'>Select</th>
                                                        <th className='govuk-table__header'>Case Reference</th>
                                                        <th className='govuk-table__header'>Current Stage</th>
                                                        <th className='govuk-table__header'>Owner</th>
                                                        <th className='govuk-table__header'>Team</th>
                                                        <th className='govuk-table__header'>Stage Deadline</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='govuk-table__body'>
                                                    {items && items.map(this.renderRow.bind(this))}
                                                </tbody>
                                            </table>
                                            <span className='govuk-hint' aria-live='polite'>
                                                {items.length} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='govuk-grid-row'>
                                    <div className='govuk-grid-column-one-half'>
                                        <h3 className='govuk-heading-s'>
                                            Quick Actions
                                        </h3>
                                        <ul className='govuk-list'>
                                            <li>
                                                {allocateToUserEndpoint && LinkButton({ label: 'Allocate cases to me', endpoint: (baseUrl + allocateToUserEndpoint), submitHandler })}
                                            </li>
                                            <li>
                                                {allocateToWorkstackEndpoint && LinkButton({ label: 'Unallocate cases', endpoint: (baseUrl + allocateToWorkstackEndpoint), submitHandler })}
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
    selectedCases: PropTypes.array.isRequired,
    teamMembers: PropTypes.array.isRequired,
    allocateToUserEndpoint: PropTypes.string.isRequired,
    allocateToTeamEndpoint: PropTypes.string.isRequired,
    allocateToWorkstackEndpoint: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired
};
