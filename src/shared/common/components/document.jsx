import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DocumentPreview extends Component {

    renderDocumentPreview() {
        const { activeDocument, caseId } = this.props;
        return (
            <embed
                src={`/case/${caseId}/document/${activeDocument}/preview`}
                type='application/pdf'
                width='100%' height='100%'
                alt='pdf'
                pluginspage='http://www.adobe.com/products/acrobat/readstep2.html'
            />
        );
    }

    render() {
        const { activeDocument } = this.props;
        return (
            <div className='document-preview'>
                {activeDocument && this.renderDocumentPreview()}
            </div>
        );
    }

}

DocumentPreview.propTypes = {
    activeDocument: PropTypes.string.isRequired,
    caseId: PropTypes.string.isRequired,
};

export default DocumentPreview;
