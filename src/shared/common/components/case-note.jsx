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

const CaseNote = ({ author, date, modifiedBy, modifiedDate, note, refreshNotes, timelineItemUUID, title }) => {
    const { dispatch, hasRole, page, track } = React.useContext(Context);
    const [isEditing, setIsEditing] = React.useState(false);
    const [submissionError, setSubmissionError] = React.useState();
    const [caseNote, setCaseNote] = React.useState(note);

    const canEdit = hasRole('EDIT_CASE_NOTE');
    const onCancelClick = React.useCallback(e => {
        e.preventDefault();
        setIsEditing(false);
        setCaseNote(note);
    }, [note]);

    const onCaseNoteChange = React.useCallback(e => {
        setCaseNote(e.target.value);
    }, []);

    const onEditClick = React.useCallback(e => {
        e.preventDefault();
        setIsEditing(true);
    }, []);

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
                                    refreshNotes();
                                }
                            });
                    })
                    .then(() => track('EVENT', { category: 'Case notes', action: 'Add' }))
                    .catch(() => dispatch(updateApiStatus(status.UPDATE_CASE_NOTE_FAILURE)));
            });
    }, [caseNote]);

    return isEditing ? <Fragment>
        <form id={`#edit-case-note${timelineItemUUID}`} action={`/case/${page.params.caseId}/note/${timelineItemUUID}`}
            onSubmit={onSubmit}>
            <div className={`govuk-form-group${submissionError ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={'case-note'} id={'case-note-label'} className='govuk-label govuk-label--s'>{title}.</label>

                {submissionError && <span id={'case-note-error'} className='govuk-error-message'>{submissionError}</span>}

                <textarea className={'govuk-textarea form-control-3-4'}
                    id='case-note'
                    name='case-note'
                    disabled={false}
                    rows={5}
                    onBlur={onCaseNoteChange}
                    onChange={onCaseNoteChange}
                    value={caseNote}
                />
            </div>
            <div className="form-buttons">
                <Submit label='Save' />
                <a className="govuk-link" href="#" onClick={onCancelClick}>Cancel</a>
            </div>
        </form>
    </Fragment> :
        <Fragment>
            {caseNote && <p>
                <span className="case-note-number govuk-!-font-weight-bold">{title}.</span>
                {caseNote.split(/\n/).map((line, i) => (<Fragment key={i}>{line}<br /></Fragment>))}
            </p>}
            {modifiedBy && <p>
                <span>{`Edited on ${modifiedDate} - ${modifiedBy}`}</span>
            </p>}
            <p>
                {date && <span>{date}</span>}
                {author && <span>{author}</span>}
                {canEdit && <span className="edit-link" onClick={onEditClick}><a href={`#edit-case-note${timelineItemUUID}`}>Edit</a></span>}
            </p>
        </Fragment>;
};

CaseNote.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    modifiedBy: PropTypes.string,
    modifiedDate: PropTypes.string,
    note: PropTypes.string,
    refreshNotes: PropTypes.func,
    timelineItemUUID: PropTypes.string,
    title: PropTypes.string,
};

export default CaseNote;
