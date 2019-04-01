import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Document from './document.jsx';
import DocumentList from './document-list.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import { Link } from 'react-router-dom';

class DocumentPanel extends Component {

    constructor(props) {
        super(props);
        let activeDocument;
        if (props.documents && props.documents.length > 0) {
            activeDocument = props.documents[0].value || null;
        }
        this.state = { ...props, activeDocument };
    }

    componentDidMount() {
        this.updateDocuments();
        this.interval = setInterval(() => this.updateDocuments(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    hasPendingDocuments(documents) {
        return documents.some(d => d.status === 'PENDING');
    }

    updateDocuments() {
        const { dispatch } = this.props;
        const { page } = this.state;
        if (page && page.params && page.params.caseId) {
            // TODO: Remove
            /* eslint-disable-next-line  no-console*/
            console.log(`Updating documents for case: ${page.params.caseId}`);
            return dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/document`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    this.setState({
                                        documents: response.data,
                                        activeDocument: this.state.activeDocument || response.data[0] ? response.data[0].value : null
                                    });
                                    if (!this.hasPendingDocuments(response.data)) {
                                        // TODO: Remove
                                        /* eslint-disable-next-line  no-console*/
                                        console.log('No documents pending conversion, clearing interval');
                                        if (this.interval) { clearInterval(this.interval); }
                                    }
                                });
                        })
                        .catch(() => {
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_FAILURE))
                                .then(() => clearInterval(this.interval));
                        });
                });
        }
    }

    setActiveDocument(document) {
        this.setState({ activeDocument: document });
    }

    render() {
        const { documents, activeDocument } = this.state;
        const { page } = this.props;
        return (
            <Fragment>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        {activeDocument && page.params.caseId && <Document caseId={page.params.caseId} activeDocument={activeDocument} />}
                        {documents && documents.length > 0 && <DocumentList
                            caseId={page.params.caseId}
                            stageId={page.params.stageId}
                            documents={documents}
                            activeDocument={activeDocument}
                            clickHandler={this.setActiveDocument.bind(this)}
                        />}
                        <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/document/manage`} >Manage Documents</Link>
                    </div>
                </div>
            </Fragment>
        );
    }

}

DocumentPanel.defaultProps = {
    page: {}
};

DocumentPanel.propTypes = {
    dispatch: PropTypes.func.isRequired,
    documents: PropTypes.array,
    page: PropTypes.object.isRequired,
};

const WrappedDocumentPanel = props => (
    <ApplicationConsumer>
        {({ dispatch, documents, page }) => <DocumentPanel {...props} dispatch={dispatch} documents={documents} page={page} />}
    </ApplicationConsumer>
);

export default WrappedDocumentPanel;