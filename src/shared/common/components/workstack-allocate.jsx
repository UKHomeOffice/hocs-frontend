import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Workstack extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    componentDidMount() {
        this.setState({ mounted: true });
    }

    _onChange(e) {
        const workstack = this.props.workstack;
        const filter = e.target.value ? e.target.value.toUpperCase() : '';
        if (filter !== '') {
            const filtered = workstack.filter(r => {
                return (r.caseReference && r.caseReference.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedUserDisplay && r.assignedUserDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.assignedTeamDisplay && r.assignedTeamDisplay.toUpperCase().indexOf(filter) !== -1) ||
                    (r.deadline && r.deadline.toUpperCase().indexOf(filter) !== -1) ||
                    (r.stageTypeDisplay && r.stageTypeDisplay.toUpperCase().indexOf(filter) !== -1);
            });
            this.setState({ workstack: filtered });
        } else {
            this.setState({ workstack });
        }
    }

    render() {
        const cases = this.state.workstack;
        const mounted = this.state.mounted;
        let name = 'test', className, hint = 'Search by fields e.g \'Initial Draft\'', error, disabled;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    {mounted &&
                        <div className='govuk-form-group'>
                            <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                                <span className="govuk-fieldset__heading govuk-label--s">Workstack</span>
                            </legend>
                            <input className='govuk-input govuk-!-width-one-third'
                                id='workstack-filter'
                                type='text'
                                name='workstack-filter'
                                onChange={e => this._onChange(e)}
                            />
                        </div>
                    }
                    <div className='workstack'>
                        <table className='govuk-table'>
                            <caption className='govuk-table__caption'>Workstack</caption>
                            <thead className='govuk-table__head'>
                                <tr className='govuk-radios govuk-table__row'>
                                    <th className='govuk-table__header'>Selected</th>
                                    <th className='govuk-table__header'>Type</th>
                                    <th className='govuk-table__header'>Reference</th>
                                    <th className='govuk-table__header'>Stage</th>
                                    <th className='govuk-table__header'>User</th>
                                    <th className='govuk-table__header'>Team</th>
                                    <th className='govuk-table__header'>Deadline</th>
                                </tr>
                            </thead>
                            <tbody className='govuk-table__body'>
                                {
                                    cases && cases.sort((first, second) => first.caseReference.split('/')[1] > second.caseReference.split('/')[1] ? -1 : 1).map((c, i) => {
                                        return (
                                            <tr key={i} className='govuk-radios govuk-table__row'>
                                                <td className='govuk-table__cell'>
                                                    <div className='govuk-checkboxes'>
                                                        <div key={i} className="govuk-checkboxes__item">
                                                            <input id={c.caseUUID}
                                                                type='checkbox'
                                                                name={c.caseUUID}
                                                                value={c.caseUUID}
                                                                onChange={e => e.preventDefault()}
                                                                className={'govuk-checkboxes__input'}
                                                            />
                                                            <label className="govuk-label govuk-checkboxes__label" htmlFor={c.caseUUID}></label>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='govuk-table__cell'>
                                                    {c.caseTypeDisplay && <strong className='govuk-tag'>{c.caseTypeDisplay}</strong>}
                                                </td>
                                                <td className='govuk-table__cell'>{
                                                    c.userUUID === null ?
                                                        <Link to={`/case/${c.caseUUID}/stage/${c.uuid}/allocate`} className="govuk-link govuk-!-margin-right-3">{c.caseReference}</Link> :
                                                        <Link to={`/case/${c.caseUUID}/stage/${c.uuid}`} className="govuk-link govuk-!-margin-right-3">{c.caseReference}</Link>
                                                }</td>
                                                <td className='govuk-table__cell'>{c.stageTypeDisplay}</td>
                                                <td className='govuk-table__cell'>{c.assignedUserDisplay}</td>
                                                <td className='govuk-table__cell'>{c.assignedTeamDisplay}</td>
                                                <td className='govuk-table__cell'>{c.deadline}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </fieldset>

            </div>
        );
    }
}

Workstack.propTypes = {
    workstack: PropTypes.array.isRequired
};

export default Workstack;