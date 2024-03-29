import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import classnames from 'classnames';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCaseNotes,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import Submit from '../forms/submit.jsx';
import CaseNote from './case-note.jsx';

const AuditEvent = ({ date, author, user, team, stage, document, topic, correspondent, title, note }) => (
    <Fragment>
        {<p><strong>{title}</strong></p>}
        {stage && <p>Stage: {stage}</p>}
        {team && <p>Assigned team: {team}</p>}
        {user && <p>Assigned user: {user}</p>}
        {document && <p>Document: {document}</p>}
        {correspondent && <p>Name: {correspondent}</p>}
        {topic && <p>Name: {topic}</p>}
        {note && <p>{note.split('\n')
            .map(((line, idx) => <p key={idx}>{ idx===0 ? 'Note: ' : ''}{line}</p>))}</p>}
        <p>
            {date && <span>{date}</span>}
            {author && <span>{author}</span>}
        </p>
    </Fragment>
);

AuditEvent.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    user: PropTypes.string,
    team: PropTypes.string,
    stage: PropTypes.string,
    document: PropTypes.string,
    topic: PropTypes.string,
    correspondent: PropTypes.string,
    title: PropTypes.string,
    note: PropTypes.string,
};

// Suppressing prop types here because they are set, but ESLint is still flagging as issues
// @TODO: Fix false positive prop type warning
// eslint-disable-next-line react/display-name,react/prop-types
const TimelineItem = (refreshNotes) => ({ type, body, title, timelineItemUUID }) => {
    const isCaseNote = [
        'MANUAL', 'CLOSE_CASE_TELEPHONE', 'CONVERTED_CASE_TO_MINISTERIAL', 'CONVERTED_CASE_TO_OFFICIAL', 'ALLOCATE',
        'CHANGE', 'CLOSE', 'REJECT', 'PHONECALL', 'REQUEST_CONTRIBUTION', 'SEND_TO_WORKFLOW_MANAGER', 'FOLLOW_UP',
        'FOLLOW_UP_NOT_COMPLETED', 'WITHDRAW', 'CASE_TRANSFER_REASON',
        'ENQUIRY_REASON_EUNATIONAL_OTHERDETAILS','RECORD_INTEREST', 'UPDATE_INTEREST',
        'REFER'
    ].includes(type);
    return (
        body && <li key={timelineItemUUID} className={classnames({ 'case-note': isCaseNote })}>
            {isCaseNote ? <CaseNote {...body} title={title} timelineItemUUID={timelineItemUUID} refreshNotes={refreshNotes} /> : <AuditEvent {...body} title={title} />}
        </li>
    );
};

TimelineItem.propTypes = {
    type: PropTypes.string,
    body: PropTypes.object,
    title: PropTypes.string,
    timelineItemUUID: PropTypes.string
};

TimelineItem.displayName = 'TimelineItem';

class Timeline extends Component {

    constructor(props) {
        super(props);
        const { caseNotes } = props;
        this.state = { caseNotes, caseNote: '' };
    }

    componentDidMount() {
        const { caseNotes } = this.props;
        if (!caseNotes) {
            this.getCaseNotes();
        }
        this.props.dispatch(unsetCaseNotes());
    }

    getCaseNotes() {
        const { dispatch, page } = this.props;
        if (page && page.params && page.params.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_CASE_NOTES))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/caseNotes`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_CASE_NOTES_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    this.setState({
                                        caseNotes: response.data,
                                    });
                                });
                        })
                        .catch(() => {
                            dispatch(updateApiStatus(status.REQUEST_CASE_NOTES_FAILURE))
                                .then(() => clearInterval(this.interval));
                        });
                });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const { page } = this.props;
        const { caseNote } = this.state;
        // TODO: Remove
        /* eslint-disable-next-line no-undef */
        const formData = new FormData();
        formData.append('caseNote', caseNote);
        axios.post(`/api/case/${page.params.caseId}/note`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                this.setState({ caseNote: '', submissionError: response.data.error });
                this.getCaseNotes();
            })
            // TODO: Remove
            /* eslint-disable-next-line  no-console*/
            .catch(() => console.error('Failed to submit case note'));
    }

    render() {
        const { page } = this.props;
        const { caseNote, caseNotes, submissionError } = this.state;
        return (
            <Fragment>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <details className='govuk-details'>
                            <summary className='govuk-details__summary'>
                                <span className='govuk-details__summary-text'>
                                    Add case note
                                </span>
                            </summary>
                            <div className='govuk-details__text'>
                                <form action={`/case/${page.params.caseId}/stage/${page.params.stageId}/note`} onSubmit={e => this.onSubmit(e)}>
                                    <div className={`govuk-form-group${submissionError ? ' govuk-form-group--error' : ''}`}>

                                        <label htmlFor={'case-note'} id={'case-note-label'} className='govuk-label govuk-label--s'>Case note</label>

                                        {submissionError && <p id={'case-note-error'} className='govuk-error-message'>{submissionError}</p>}

                                        <textarea className={'govuk-textarea form-control-3-4'}
                                            id='case-note'
                                            name='case-note'
                                            disabled={false}
                                            rows={5}
                                            onBlur={e => this.setState({ caseNote: e.target.value })}
                                            onChange={e => this.setState({ caseNote: e.target.value })}
                                            value={caseNote}
                                        />
                                    </div>
                                    <Submit label='Add' />
                                </form>
                            </div>
                        </details>
                        <div className='timeline'>
                            <ul>
                                {Array.isArray(caseNotes) && caseNotes.map(TimelineItem(this.getCaseNotes.bind(this)))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

}

Timeline.propTypes = {
    caseNotes: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
};

const WrappedTimeline = props => (
    <ApplicationConsumer>
        {({ dispatch, caseNotes, page }) => <Timeline {...props} dispatch={dispatch} page={page} caseNotes={caseNotes} />}
    </ApplicationConsumer>
);

export default WrappedTimeline;
