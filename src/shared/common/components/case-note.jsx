import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import {
    updateApiStatus,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import { Context } from '../../contexts/application.jsx';
import Submit from '../forms/submit.jsx';

const CaseNote = ({ timelineItemUUID, date, author, note, title }) => {
    const { dispatch, page, track } = React.useContext(Context);
    const [isEditing, setIsEditing] = React.useState(false);
    const [submissionError, setSubmissionError] = React.useState();
    const [caseNote, setCaseNote] = React.useState(note);

    const onEditClick = React.useCallback(e => {
        e.preventDefault();
        setIsEditing(true);
    });


    const onSubmit = React.useCallback(e => {
        e.preventDefault();

        /* eslint-disable-next-line no-undef */
        const formData = new FormData();
        formData.append('caseNote', caseNote);
        dispatch(updateApiStatus(status.REQUEST_CASE_NOTES))
            .then(() => {
                axios.put(`/api/case/${page.params.caseId}/note/${timelineItemUUID}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(({ data: { error } = {} }) => {
                        dispatch(updateApiStatus(status.UPDATE_CASE_NOTES_SUCCESS))
                            .then(() => dispatch(clearApiStatus()))
                            .then(() => {
                                if (error) {
                                    setSubmissionError(error);
                                } else {
                                    setIsEditing(false);
                                }
                            });
                    })
                    .then(() => track('EVENT', { category: 'Case notes', action: 'Add' }))
                    .catch(() => dispatch(updateApiStatus(status.UPDATE_CASE_NOTE_FAILURE)));
            });
    }, [caseNote]);

    return isEditing ? <>
        <form id={`#edit-case-note${timelineItemUUID}`} action={`/case/${page.params.caseId}/note/${timelineItemUUID}`}
            onSubmit={onSubmit}>
            <div className={`govuk-form-group${submissionError ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={'case-note'} id={'case-note-label'} className='govuk-label govuk-label--s'>Case note</label>

                {submissionError && <span id={'case-note-error'} className='govuk-error-message'>{submissionError}</span>}

                <textarea className={'govuk-textarea form-control-3-4'}
                    id='case-note'
                    name='case-note'
                    disabled={false}
                    rows={5}
                    onBlur={e => setCaseNote({ caseNote: e.target.value })}
                    onChange={e => setCaseNote({ caseNote: e.target.value })}
                    value={caseNote}
                />
            </div>
            <Submit label='Add' />
        </form>
    </> :
        <Fragment>
            {note && <p>
                <span className="case-note-number govuk-!-font-weight-bold">Case note {title}.</span>
                {note.split(/\n/).map((line, i) => (<Fragment key={i}>{line}<br /></Fragment>))}
            </p>}
            <p>
                {date && <span>{date}</span>}
                {author && <span>{author}</span>}
                {<span onClick={onEditClick}><a href={`#edit-case-note${timelineItemUUID}`}>Edit</a></span>}
            </p>
        </Fragment>;
};

CaseNote.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    note: PropTypes.string,
    timelineItemUUID: PropTypes.string,
    title: PropTypes.string,
};

export default CaseNote;
