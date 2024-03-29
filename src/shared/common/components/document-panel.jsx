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
import {
    flattenDocuments,
    getFirstDocumentWithPdfLink,
    hasPendingDocuments
} from '../../helpers/document-helpers';


class DocumentPanel extends Component {

    constructor(props) {
        super(props);
        let activeDocument;
        if (props.documents && props.documents.length > 0) {
            activeDocument = getFirstDocumentWithPdfLink(flattenDocuments(props.documents));
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

    setActiveDocument(document) {
        this.setState({ activeDocument: document });
    }

    updateDocuments() {
        const { dispatch } = this.props;
        const { page } = this.state;
        if (page && page.params && page.params.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/document`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    if (Array.isArray(response.data)) {
                                        const allDocuments = flattenDocuments(response.data);
                                        this.setState((currentState) => ({
                                            ...currentState,
                                            documents: response.data,
                                            activeDocument: currentState.activeDocument || getFirstDocumentWithPdfLink(allDocuments)
                                        }));
                                        if (!hasPendingDocuments(allDocuments)) {
                                            if (this.interval) {
                                                clearInterval(this.interval);
                                            }
                                        }
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

    render() {
        const { documents, activeDocument } = this.state;
        const { page } = this.props;
        return (
            <Fragment>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <Link className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/document/manage`} >Manage Documents</Link>
                        {activeDocument && page.params.caseId && <Document caseId={page.params.caseId} activeDocument={activeDocument} />}
                        {documents && documents.length > 0 && <DocumentList
                            caseId={page.params.caseId}
                            stageId={page.params.stageId}
                            documents={documents}
                            activeDocument={activeDocument}
                            clickHandler={this.setActiveDocument.bind(this)}
                        />}
                    </div>
                </div>
            </Fragment>
        );
    }

}

DocumentPanel.defaultProps = {
    page: {},
    documents: []
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
