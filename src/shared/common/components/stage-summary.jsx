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
            <Fragment key={stage}>
                <h3 className='govuk-heading-m'>{stage}</h3>
                <div className='margin-left--small'>
                    <p className='govuk-body'><strong>Team</strong> {assignedTeam}</p>
                    <p className='govuk-body'><strong>User</strong> {assignedUser}</p>
                </div>
            </Fragment>
        );
    }

    render() {
        const { summary } = this.state;
        return (
            <Fragment>
                {summary &&
                    <Fragment>
                        <h3 className='govuk-heading-m'>Case</h3>
                        <div className='margin-left--small'>
                            {summary.case && summary.case.received && <p className='govuk-body'>
                                <strong>Date received</strong> {summary.case.received}
                            </p>}
                            {summary.case && summary.case.deadline && <p className='govuk-body'>
                                <strong>Deadline</strong> {summary.case.deadline}
                            </p>}
                        </div>
                        <h3 className='govuk-heading-m'>Active stages</h3>
                        <div className='margin-left--small'>
                            {summary.stages.map(stage => this.renderActiveStage(stage))}
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

StageSummary.propTypes = {
};

export default props => (
    <ApplicationConsumer>
        {({ dispatch, summary, page }) => <StageSummary {...props} dispatch={dispatch} summary={summary} page={page} />}
    </ApplicationConsumer>
);