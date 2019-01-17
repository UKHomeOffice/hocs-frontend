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

export default class WorkstackAllocate extends Component {

    constructor(props) {
        super(props);
        this.state = { items: props.items };
    }

    componentDidMount() {
        this.setState({ isMounted: true })
    }

    filter(e) {
        // filter the stack
        const { items } = this.props;
        const filter = e.target.value ? e.target.value.toUpperCase() : '';
        if (filter !== '') {
            const filtered = items.filter(r => {
                return (r.caseReference && r.caseReference.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedUserDisplay && r.assignedUserDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedTeamDisplay && r.assignedTeamDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.deadlineDisplay && r.deadlineDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.stageTypeDisplay && r.stageTypeDisplay.toUpperCase().indexOf(filter) !== -1);
            });
            this.setState(state => ({ items: filtered }));
        } else {
            this.setState(state => ({ items }));
        }
    }

    renderFilter() {
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <div className='govuk-form-group filter-row'>
                        <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                            <span className="govuk-fieldset__heading govuk-label--s">Case Filter</span>
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
        return (
            <tr key={key} className='govuk-radios govuk-table__row'>
                <td className='govuk-table__cell'>
                    <div className='govuk-checkboxes'>
                        <div key={key} className='govuk-checkboxes__item'>
                            <input id={`selected_cases_${caseUUID}`}
                                type='checkbox'
                                name={'selected_cases[]'}
                                value={value}
                                checked={false}
                                onChange={() => { }}
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
                <Dropdown label='Allocate cases to a user' name="selected_user" updateState={() => { }} choices={teamMembers} />
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
                        <form action={baseUrl + allocateToTeamEndpoint} method='POST' onSubmit={e => submitHandler(e, baseUrl + allocateToTeamEndpoint)} encType="multipart/form-data">
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
                                                    {items && items.map(this.renderRow)}
                                                </tbody>
                                            </table>
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
        )
    }
}

WorkstackAllocate.propTypes = {
}
