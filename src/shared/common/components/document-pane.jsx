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

class DocumentPanel extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    componentDidMount() {
        const { dispatch, page } = this.props;
        if (page) {
            return dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST))
                .then(() => {
                    axios.get(`/case/${page.caseId}/document`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_DOCUMENT_LIST_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => this.setState({
                                    documents: response.data,
                                    activeDocument: response.data[0] ?
                                        response.data[0].s3_pdf_link :
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
                <Document caseId={page.caseId} activeDocument={activeDocument} />
                {documents && documents.length > 0 && <DocumentList
                    caseId={page.caseId}
                    documents={documents}
                    activeDocument={activeDocument}
                    clickHandler={this.setActiveDocument.bind(this)}
                />}
            </Fragment>
        );
    }

}

DocumentPanel.defaultProps = {
    documents: [],
    page: {}
};

DocumentPanel.propTypes = {
    dispatch: PropTypes.func.isRequired,
    documents: PropTypes.array,
    page: PropTypes.object.isRequired,
};

const WrappedDocumentPanel = props => (
    <ApplicationConsumer>
        {({ dispatch, page }) => <DocumentPanel {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default WrappedDocumentPanel;