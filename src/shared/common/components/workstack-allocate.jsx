import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Dropdown from '../forms/dropdown.jsx';
import Submit from '../forms/submit.jsx';
import axios from 'axios';

class Workstack extends Component {

    constructor(props) {
        super(props);
        this.state = { workstack: props.items, data: { selected_cases: [], selected_user: null } };
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    _onChange(e) {
        const workstack = this.props.items;
        const filter = e.target.value ? e.target.value.toUpperCase() : '';
        if (filter !== '') {
            const filtered = workstack.filter(r => {
                return (r.caseReference && r.caseReference.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedUserDisplay && r.assignedUserDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedTeamDisplay && r.assignedTeamDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.deadlineDisplay && r.deadlineDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.stageTypeDisplay && r.stageTypeDisplay.toUpperCase().indexOf(filter) !== -1);
            });
            this.setState(state => ({ workstack: filtered, data: { ...state.data, selected_cases: filtered.filter(i => state.data.selected_cases.includes(`${i.caseUUID}:${i.uuid}`)).map(i => `${i.caseUUID}:${i.uuid}`) } }));
        } else {
            this.setState(state => ({ workstack, data: state.data }));
        }
    }

    handleSubmit(e, endpoint) {
        e.preventDefault();
        const { data } = this.state;
        // TODO: Remove
        /* eslint-disable-next-line no-undef */
        const formData = new FormData();
        Object.keys(data).forEach(field => {
            if (Array.isArray(data[field])) {
                data[field].map(value => {
                    formData.append(`${field}`, value);
                });
            } else {
                formData.append(field, data[field]);
            }
        });
        axios.post('/api' + endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(({ data: { workstack, notification } }) => this.setState({ workstack: workstack.items, notification }));
    }

    render() {
        const { workstack: cases, mounted, notification } = this.state;
        const { baseUrl, teamMembers, allocateToUserEndpoint, allocateToTeamEndpoint, allocateToWorkstackEndpoint } = this.props;
        let name = 'test', className, error, disabled;
        return (
            <Fragment>
                {notification && <div className='ribbon ribbon--warning'><p>{notification}</p></div>}
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        {mounted &&
                            <div className='govuk-form-group filter-row'>
                                <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                                    <span className="govuk-fieldset__heading govuk-label--s">Case Filter</span>
                                </legend>
                                <input className='govuk-input govuk-!-width-one-third'
                                    id='workstack-filter'
                                    type='text'
                                    name='workstack-filter'
                                    onChange={e => this._onChange(e)}
                                />
                            </div>
                        }
                    </div>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <form action={baseUrl + allocateToTeamEndpoint} method='POST' onSubmit={e => this.handleSubmit(e, baseUrl + allocateToTeamEndpoint)} encType="multipart/form-data">
                            <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>
                                <div className="govuk-grid-row">
                                    <div className="govuk-grid-column-full">
                                        <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}></div>
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
                                                    {
                                                        cases && cases.sort((first, second) => {
                                                            if (first.deadline === second.deadline) {
                                                                return first.caseReference.split('/')[1] < second.caseReference.split('/')[1] ? -1 : 1;
                                                            }
                                                            return first.deadline < second.deadline ? -1 : 1;
                                                        }).map((c, i) => {
                                                            const value = `${c.caseUUID}:${c.uuid}`;
                                                            return (
                                                                <tr key={i} className='govuk-radios govuk-table__row'>
                                                                    <td className='govuk-table__cell'>
                                                                        <div className='govuk-checkboxes'>
                                                                            <div key={i} className="govuk-checkboxes__item">
                                                                                <input id={`selected_cases_${c.caseUUID}`}
                                                                                    type='checkbox'
                                                                                    name={'selected_cases[]'}
                                                                                    value={value}
                                                                                    checked={this.state.data.selected_cases.includes(value)}
                                                                                    onChange={e => {
                                                                                        const selection = new Set(this.state.data.selected_cases || []);
                                                                                        if (selection.has(e.target.value)) {
                                                                                            selection.delete(e.target.value);
                                                                                        } else {
                                                                                            selection.add(e.target.value);
                                                                                        }
                                                                                        this.setState(state => ({ ...state, data: { ...state.data, selected_cases: Array.from(selection) } }));
                                                                                    }}
                                                                                    className={'govuk-checkboxes__input'}
                                                                                />
                                                                                <label className="govuk-label govuk-checkboxes__label" htmlFor={c.caseUUID}></label>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className='govuk-table__cell'>
                                                                        <Link to={`/case/${c.caseUUID}/stage/${c.uuid}`} className="govuk-link govuk-!-margin-right-3">{c.caseReference}</Link>
                                                                    </td>
                                                                    <td className='govuk-table__cell'>{c.stageTypeDisplay}</td>
                                                                    <td className='govuk-table__cell'>{c.assignedUserDisplay}</td>
                                                                    <td className='govuk-table__cell'>{c.assignedTeamDisplay}</td>
                                                                    <td className='govuk-table__cell'>{c.deadlineDisplay}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="govuk-grid-row">
                                    <div className="govuk-grid-column-one-half">
                                        {teamMembers &&
                                            <Fragment>
                                                <Dropdown label='Allocate cases to a user' name="selected_user" updateState={values => {
                                                    this.setState(state => ({
                                                        ...state, data: { ...state.data, ...values }
                                                    }));
                                                }} choices={teamMembers} />
                                                <Submit label='Allocate' />
                                            </Fragment>
                                        }
                                        <h3 className="govuk-heading-s">
                                            Quick Actions
                                        </h3>
                                        <ul className="govuk-list">
                                            {allocateToUserEndpoint &&
                                                <li>
                                                    <button type='submit' onClick={e => this.handleSubmit(e, baseUrl + allocateToUserEndpoint)} className='govuk-button--link govuk-link' formMethod='POST' formEncType='multipart/form-data' formAction={baseUrl + allocateToUserEndpoint}>Allocate cases to me</button>
                                                </li>}
                                            {allocateToWorkstackEndpoint &&
                                                <li>
                                                    <button type='submit' onClick={e => this.handleSubmit(e, baseUrl + allocateToWorkstackEndpoint)} className='govuk-button--link govuk-link' formMethod='POST' formEncType='multipart/form-data' formAction={baseUrl + allocateToWorkstackEndpoint}>Unallocate cases</button>
                                                </li>}

                                        </ul>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </Fragment >
        );
    }
}

Workstack.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    teamMembers: PropTypes.array,
    allocateToTeamEndpoint: PropTypes.string.isRequired,
    allocateToUserEndpoint: PropTypes.string.isRequired,
    allocateToWorkstackEndpoint: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
};

Workstack.defaultProps = {
    items: []
};

export default Workstack;