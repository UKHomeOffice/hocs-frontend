import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';

class CaseNotes extends Component {

    constructor(props) {
        super(props);
        const { caseNotes } = props;
        this.state = { caseNotes }
    }

    componentDidMount() {
        this.getCaseNotes();
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

    renderCaseNoteEvent(event, key) {
        return (<Fragment key={key}>
            <p className='time'>{event.date}</p>
            {event.note.author ? <p>{`${event.note.author}: "${event.note.message}"`}</p> : <p>{event.note.message}</p>}
        </Fragment>);
    }

    renderCaseNote(caseNote, key) {
        return (<li key={key} className={key === 0 ? 'recent-action' : null}>
            <h2>{caseNote.type}</h2>
            {caseNote.events && caseNote.events.map((e, i) => this.renderCaseNoteEvent(e, i))}
        </li>);
    }

    render() {
        const { caseNotes } = this.state;
        return (
            <Fragment>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <div className='timeline'>
                            <ul>
                                {caseNotes && caseNotes.map((n, i) => this.renderCaseNote(n, i))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

}

CaseNotes.defaultProps = {
    caseNotes: []
};

CaseNotes.propTypes = {
    caseNotes: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired
};

const WrappedCaseNotes = props => (
    <ApplicationConsumer>
        {({ dispatch, caseNotes, page }) => <CaseNotes {...props} dispatch={dispatch} page={page} caseNotes={caseNotes} />}
    </ApplicationConsumer>
);

export default WrappedCaseNotes;