import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DocumentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [
                'Claimant form',
                'Supporting evidence',
                'Matrix',
                'Outbound letter'
            ]
        };
    }

    _onClick(e, document) {
        e.preventDefault();
        this.props.clickHandler(document);
    }

    reduceDocumentsByTag(groups, document) {
        Array.isArray(document.tags) && document.tags.map(tag => {
            const group = groups.get(tag);
            group && group.push(document);
        });
        return groups;
    }

    render() {
        const { activeDocument, caseId, stageId, documents } = this.props;
        return (
            <>
                {
                    [...documents.reduce(this.reduceDocumentsByTag, new Map(this.state.tags.map(tag => [tag, []])))]
                        .map(([tagGroupName, groupedDocuments]) => (
                            <table key={tagGroupName} className='govuk-table'>
                                <caption className='govuk-table__caption'>{tagGroupName}</caption>
                                <tbody className='govuk-table__body'>
                                    {
                                        caseId && Array.isArray(groupedDocuments) && groupedDocuments.map((d, i) => (
                                            <tr key={i} className='govuk-table__row'>
                                                <td className='govuk-table__cell'>
                                                    {Array.isArray(d.tags) && d.tags.map((tag) => <strong key={tag} className='govuk-tag margin-right--small'>{tag}</strong>)}
                                                </td>
                                                <td className='govuk-table__cell'>
                                                    {d.label}
                                                </td>
                                                <td className='govuk-table__cell'>
                                                    {d.value && d.status === 'UPLOADED' && caseId && activeDocument !== d.value &&
                                                        <a
                                                            id={`${d.value}-pdf`}
                                                            href={`/case/${caseId}/stage/${stageId}/download/document/${d.value}/pdf`}
                                                            className='govuk-link'
                                                            onClick={e => this._onClick(e, `${d.value}`)}
                                                        >
                                                            Preview
                                                        </a>
                                                    }
                                                </td>
                                                <td className='govuk-table__cell'>
                                                    {d.value && d.status === 'UPLOADED' && caseId && <a href={`/case/${caseId}/stage/${stageId}/download/document/${d.value}/original`} className='govuk-link' download={d.label} >Download</a>}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ))
                }
            </>
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
