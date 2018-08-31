import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DocumentList extends Component {

    getFileName(file) {
        return file.substring(0, file.lastIndexOf('.')) || file;
    }

    _onClick(e, document) {
        e.preventDefault();
        this.props.clickHandler(document);
    }

    render() {
        const { activeDocument, caseId, documents } = this.props;
        return (
            <table className='govuk-table'>
                <caption className='govuk-table__caption'>Documents</caption>
                <tbody className='govuk-table__body'>
                    {
                        documents.map((d, i) => (
                            <tr key={i} className='govuk-table__row'>
                                <td className='govuk-table__cell'>
                                    <strong className='govuk-tag'>{d.type}</strong>
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.name}
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.document_uuid && caseId && activeDocument !== d.s3_pdf_link && <a href={`/case/${caseId}/document/${d.s3_pdf_link}`} className='govuk-link' download={`${this.getFileName(d.name)}.pdf`} onClick={e => this._onClick(e, `${this.getFileName(d.s3_pdf_link)}.pdf`)}>Preview</a>}
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.document_uuid && caseId && <a href={`/case/${caseId}/document/${d.s3_orig_link}`} className='govuk-link' download={d.name} >Download</a>}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

}

DocumentList.defaultProps = {
    documents: []
};

DocumentList.propTypes = {
    activeDocument: PropTypes.string,
    caseId: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired,
    stageId: PropTypes.string.isRequired,
    documents: PropTypes.array.isRequired
};

export default DocumentList;
