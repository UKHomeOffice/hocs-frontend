import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
// import classnames from 'classnames';
// import { ApplicationConsumer } from '../../contexts/application.jsx';
// import {
//     updateApiStatus,
//     unsetCaseNotes,
//     clearApiStatus
// } from '../../contexts/actions/index.jsx';
// import status from '../../helpers/api-status.js';
import { Context } from '../../contexts/application.jsx';
import Submit from '../forms/submit.jsx';



// const onSubmit = (e) => {
//     e.preventDefault();
//     const { page, track } = this.props;
//     const { caseNote } = this.state;
//     // TODO: Remove
//     /* eslint-disable-next-line no-undef */
//     const formData = new FormData();
//     formData.append('caseNote', caseNote);
//     axios.post(`/api/case/${page.params.caseId}/note`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
//         .then(response => {
//             this.setState({ caseNote: '', submissionError: response.data.error });
//             this.getCaseNotes();
//         })
//         .then(() => track('EVENT', { category: 'Case notes', action: 'Add' }))
//         // TODO: Remove
//         /* eslint-disable-next-line  no-console*/
//         .catch(() => console.error('Failed to submit case note'));
// }

const CaseNote = ({ date, author, note, title }) => {
    const { page } = React.useContext(Context);
    const [isEditing, setIsEditing] = React.useState(false);
    const [submissionError, setSubmissionError] = React.useState();
    const [caseNote, setCaseNote] = React.useState(note);
    return isEditing ? <>
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
    </> :
        <Fragment>
            {note && <p>
                <span className="case-note-number govuk-!-font-weight-bold">Case note {title}.</span>
                {note.split(/\n/).map((line, i) => (<Fragment key={i}>{line}<br /></Fragment>))}
            </p>}
            <p>
                {date && <span>{date}</span>}
                {author && <span>{author}</span>}
                {<span onClick={() => setIsEditing(true)}>Edit</span>}
            </p>
        </Fragment>;
};

CaseNote.propTypes = {
    date: PropTypes.string,
    author: PropTypes.string,
    note: PropTypes.string,
    title: PropTypes.string,
};

export default CaseNote;
