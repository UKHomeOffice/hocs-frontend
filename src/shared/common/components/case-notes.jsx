import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCaseNotes,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import Submit from '../forms/submit.jsx';

const CaseNote = ({ date, author, note }) => (
    <Fragment>
        {date && <p>{date}</p>}
        {author && <p><strong>Author: </strong>{author}</p>}
        {note && <p><strong>Message: </strong><br />{note.split(/\n/).map((line, i) => (<Fragment key={i}>{line}<br /></Fragment>))}</p>}
    </Fragment>
);

CaseNote.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    note: PropTypes.string
};

const AuditEvent = ({ date, author, user, team, stage, document, topic, correspondent }) => (
    <Fragment>
        {date && <p>{date}</p>}
        {author && <p><strong>Author:</strong> {author}</p>}
        {stage && <p><strong>Stage:</strong> {stage}</p>}
        {team && <p><strong>Assigned team:</strong> {team}</p>}
        {user && <p><strong>Assigned user:</strong> {user}</p>}
        {document && <p><strong>Document:</strong> {document}</p>}
        {correspondent && <p><strong>Name:</strong> {correspondent}</p>}
        {topic && <p><strong>Name:</strong> {topic}</p>}
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
    correspondent: PropTypes.string

};

const TimelineItem = ({ type, title, body }, i) => (
    <li key={i} className={i === 0 ? 'recent-action' : null}>
        <h2>{title}</h2>
        {body && ['MANUAL', 'ALLOCATE', 'REJECT'].includes(type) ? <CaseNote {...body} /> : <AuditEvent  {...body} />}
    </li>
);

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
            // TODO: Remove
            /* eslint-disable-next-line  no-console*/
            console.log(`Updating case notes for case: ${page.params.caseId}`);
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
        const { page, track } = this.props;
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
            .then(() => track('EVENT', { category: 'Case notes', action: 'Add' }))
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

                                        {submissionError && <span id={'case-note-error'} className='govuk-error-message'>{submissionError}</span>}

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
                                {Array.isArray(caseNotes) && caseNotes.map(TimelineItem)}
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
    track: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
};

const WrappedTimeline = props => (
    <ApplicationConsumer>
        {({ dispatch, track, caseNotes, page }) => <Timeline {...props} dispatch={dispatch} track={track} page={page} caseNotes={caseNotes} />}
    </ApplicationConsumer>
);

export default WrappedTimeline;