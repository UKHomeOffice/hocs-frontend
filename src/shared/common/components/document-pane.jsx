import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Document from './document.jsx';
import DocumentList from './document-list.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    clearApiStatus,
    setError
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import { Link } from 'react-router-dom';

class DocumentPanel extends Component {

    constructor(props) {
        super(props);
        let activeDocument;
        if (props.documents && props.documents.length > 0) {
            activeDocument = props.documents[0].s3_pdf_link;
        }
        this.state = { ...props, activeDocument };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { page } = this.state;
        if (page && page.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST))
                .then(() => {
                    axios.get(`/api/case/${page.caseId}/document`)
                        .then(response => {
                            const sortedDocuments = response.data.documents.sort((first, second) => {
                                const firstTimeStamp = first.timestamp.toUpperCase();
                                const secondTimeStamp = second.timestamp.toUpperCase();
                                return (firstTimeStamp < secondTimeStamp) ? 1 : -1;
                            });
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => this.setState({
                                    documents: sortedDocuments,
                                    activeDocument: sortedDocuments ?
                                        sortedDocuments[0].s3_pdf_link :
                                        null
                                }));
                        })
                        .catch(({ response }) => {
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_FAILURE))
                                .then(() => dispatch(setError(response.data)));
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
                {activeDocument && <Document caseId={page.caseId} activeDocument={activeDocument} />}
                {documents && documents.length > 0 && <DocumentList
                    caseId={page.caseId}
                    stageId={page.stageId}
                    documents={documents}
                    activeDocument={activeDocument}
                    clickHandler={this.setActiveDocument.bind(this)}
                />}
                <Link className='govuk-body govuk-link' to={`/case/${page.caseId}/stage/${page.stageId}/entity/document/manage`} >Manage documents</Link>
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