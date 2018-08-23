import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../contexts/application.jsx';
import axios from 'axios';
import DocumentSummary from '../common/components/document-summary.jsx';
import StageSummary from '../common/components/stage-summary.jsx';
import DeadlineSummary from '../common/components/deadline-summary.jsx';
import CaseDetailsSummary from '../common/components/case-details-summary.jsx';
import { setError } from '../contexts/actions/index.jsx';

class CaseSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            case: props.caseData || {}
        };
    }

    componentDidMount() {
        this.getSummary();
    }

    getSummary() {
        const url = this.props.match.url + '/api';
        const { dispatch } = this.props;
        axios.get(url)
            .then(res => {
                this.setState({ caseData: res.data.summary });
            })
            .catch(err => {
                dispatch(setError(err.response.data));
            });
    }

    render() {
        const {
            caseData
        } = this.state;
        if (caseData) {
            const { reference, type, timestamp, stages, uuid, documents, deadlines } = caseData;
            return (
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-l">
                            {reference && <span className="govuk-caption-l">{reference}</span>}
                            Case summary
                        </h1>
                        <CaseDetailsSummary type={type} timestamp={timestamp} uuid={uuid} />
                        {stages && <StageSummary stages={stages} />}
                        {deadlines && <DeadlineSummary deadlines={deadlines} />}
                        {documents && <DocumentSummary documents={documents} />}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-l">
                            No case data
                        </h1>
                    </div>
                </div>
            );
        }
    }
}

CaseSummary.propTypes = {
    caseData: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object,
    match: PropTypes.object
};

const WrappedCaseSummary = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <CaseSummary {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

export default WrappedCaseSummary;