import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';

class StageSummary extends Component {

    constructor(props) {
        super(props);
        this.state = { summary: props.summary };
    }

    componentDidMount() {
        const { summary } = this.props;
        if (!summary) {
            this.getSummary();
        }
    }

    getSummary() {
        const { page } = this.props;
        if (page && page.params && page.params.caseId) {
            axios.get(`/api/case/${page.params.caseId}/summary`)
                .then(response => {
                    this.setState({ summary: response.data });
                });
        }
    }

    renderActiveStage({ stage, assignedTeam, assignedUser }) {
        return (
            <table key={stage} className='govuk-table margin-left--small'>
                <caption className='govuk-table__caption' >{stage}</caption>
                <tbody className='govuk-table__body'>
                    <tr className='govuk-table__row'>
                        <th className='govuk-table__header'>Team</th>
                        <td className='govuk-table__cell'>{assignedTeam}</td>
                    </tr>
                    <tr className='govuk-table__cell'>
                        <th className='govuk-table__header'>User</th>
                        <td className='govuk-table__cell'>{assignedUser}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        const { summary } = this.state;
        return (
            <Fragment>
                {summary &&
                    <Fragment>
                        <h2 className='govuk-heading-m'>Case</h2>
                        <table className='govuk-table margin-left--small'>
                            <caption className='govuk-table__caption' >Summary</caption>
                            <tbody className='govuk-table__body'>
                                {summary.case && summary.case.received && <tr className='govuk-table__row'>
                                    <th className='govuk-table__header'>Date received</th>
                                    <td className='govuk-table__cell'>{summary.case.received}</td>
                                </tr>}
                                {summary.case && summary.case.deadline && <tr className='govuk-table__cell'>
                                    <th className='govuk-table__header'>Deadline</th>
                                    <td className='govuk-table__cell'>{summary.case.deadline}</td>
                                </tr>}
                            </tbody>
                        </table>
                        <h2 className='govuk-heading-m'>Active stages</h2>
                        {summary.stages.map(stage => this.renderActiveStage(stage))}
                    </Fragment>
                }
            </Fragment>
        );
    }
}

StageSummary.propTypes = {
    summary: PropTypes.object,
    page: PropTypes.object
};

const WrappedStageSummary = props => (
    <ApplicationConsumer>
        {({ dispatch, summary, page }) => <StageSummary {...props} dispatch={dispatch} summary={summary} page={page} />}
    </ApplicationConsumer>
);

export default WrappedStageSummary;