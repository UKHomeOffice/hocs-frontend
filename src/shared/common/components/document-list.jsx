import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DocumentList extends Component {

    _onClick(e, document) {
        e.preventDefault();
        this.props.clickHandler(document);
    }

    render() {
        const { activeDocument, caseId, stageId, documents } = this.props;
        return (
            <table className='govuk-table'>
                <caption className='govuk-table__caption'>Documents</caption>
                <tbody className='govuk-table__body'>
                    {
                        caseId && documents.map((d, i) => (
                            <tr key={i} className='govuk-table__row'>
                                <td className='govuk-table__cell'>
                                    <strong className='govuk-tag margin-right--small'>{d.type}</strong>
                                    <strong className='govuk-tag'>{d.status}</strong>
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.name}
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.document_uuid && caseId && activeDocument !== d.document_uuid && <a id={`${d.document_uuid}-pdf`} href={`/case/${caseId}/stage/${stageId}/download/document/${d.document_uuid}/pdf`} className='govuk-link' download={`${d.document_uuid}`} onClick={e => this._onClick(e, `${d.document_uuid}`)}>Preview</a>}
                                </td>
                                <td className='govuk-table__cell'>
                                    {d.document_uuid && caseId && <a href={`/case/${caseId}/stage/${stageId}/download/document/${d.document_uuid}/original`} className='govuk-link' download={d.name} >Download</a>}
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
    caseId: PropTypes.string,
    clickHandler: PropTypes.func.isRequired,
    documents: PropTypes.array.isRequired,
    stageId: PropTypes.string
};

export default DocumentList;
