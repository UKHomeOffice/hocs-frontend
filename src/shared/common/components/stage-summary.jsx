import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCaseSummary,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import PropTypes from 'prop-types';

class StageSummary extends Component {

    constructor(props) {
        super(props);
        this.state = { summary: props.summary };
    }

    componentDidMount() {
        const { summary, dispatch } = this.props;
        if (!summary) {
            this.getSummary();
        }
        dispatch(unsetCaseSummary());
    }

    getSummary() {
        const { page, dispatch } = this.props;
        if (page && page.params && page.params.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/summary`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    this.setState({
                                        summary: response.data
                                    });
                                });
                        });
                })
                .catch(() => {
                    dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY_FAILURE))
                        .then(() => clearInterval(this.interval));
                });
        }
    }

    renderActiveStage({ stage, assignedTeam, assignedUser }) {
        return (
            <table key={stage} className='govuk-table margin-left--small'>
                <caption className='govuk-table__caption margin-bottom--small' >{stage}</caption>
                <tbody className='govuk-table__body'>
                    <tr className='govuk-table__row'>
                        <th className='govuk-table__header padding-left--small'>Team</th>
                        <td className='govuk-table__cell'>{assignedTeam}</td>
                    </tr>
                    <tr className='govuk-table__cell'>
                        <th className='govuk-table__header padding-left--small'>User</th>
                        <td className='govuk-table__cell'>{assignedUser}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderRow({ label, value }) {
        return (
            <tr key={label} className='govuk-table__row'>
                <th className='govuk-table__header padding-left--small'>{label}</th>
                <td className='govuk-table__cell'>{value}</td>
            </tr>
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
                            <caption className='govuk-table__caption margin-bottom--small' >Summary</caption>
                            <tbody className='govuk-table__body'>
                                {summary.case && summary.case.received && <tr className='govuk-table__row'>
                                    <th className='govuk-table__header padding-left--small'>Date received</th>
                                    <td className='govuk-table__cell'>{summary.case.received}</td>
                                </tr>}
                                {summary.case && summary.case.deadline && <tr className='govuk-table__cell'>
                                    <th className='govuk-table__header padding-left--small'>Deadline</th>
                                    <td className='govuk-table__cell'>{summary.case.deadline}</td>
                                </tr>}
                                {summary.primaryTopic && <tr className='govuk-table__cell'>
                                    <th className='govuk-table__header padding-left--small'>Primary topic</th>
                                    <td className='govuk-table__cell'>{summary.primaryTopic}</td>
                                </tr>}
                                {summary.primaryCorrespondent && <tr className='govuk-table__cell'>
                                    <th className='govuk-table__header padding-left--small'>Primary correspondent</th>
                                    <td className='govuk-table__cell'>{summary.primaryCorrespondent}</td>
                                </tr>}
                                {summary.additionalFields && summary.additionalFields.map(({ label, value }) => this.renderRow({ label, value }))}
                            </tbody>
                        </table>
                        <table className='govuk-table margin-left--small'>
                            <caption className='govuk-table__caption margin-bottom--small' >Stage deadlines</caption>
                            <tbody className='govuk-table__body'>
                                {summary.deadlines && Array.isArray(summary.deadlines) && summary.deadlines.map(stage => this.renderRow(stage))}
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
    dispatch: PropTypes.func.isRequired,
    summary: PropTypes.object,
    page: PropTypes.object
};

const WrappedStageSummary = props => (
    <ApplicationConsumer>
        {({ dispatch, summary, page }) => <StageSummary {...props} dispatch={dispatch} summary={summary} page={page} />}
    </ApplicationConsumer>
);

export default WrappedStageSummary;