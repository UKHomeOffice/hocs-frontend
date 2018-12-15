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
        return (
            <Fragment>
                {mounted &&
                    <div className='govuk-form-group filter-row'>
                        <label htmlFor='workstack-filter' id='workstack-filter-label' className="govuk-label govuk-label--s">Case Filter</label>
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
                                if(first.deadline === second.deadline) {
                                    return first.caseReference.split('/')[1] < second.caseReference.split('/')[1] ? -1 : 1
                                }
                                return first.deadline < second.deadline ? -1 : 1
                            }).map((c, i) => {
                                return (
                                        <tr key={i} className='govuk-radios govuk-table__row'>
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
            </Fragment>
        );
    }
}

Workstack.propTypes = {
    workstack: PropTypes.array.isRequired
};

export default Workstack;