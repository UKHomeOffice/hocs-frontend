import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class DocumentList extends Component {

    constructor(props) {
        super(props);
    }

    _onClick(e, document) {
        e.preventDefault();
        this.props.clickHandler(document);
    }

    render() {
        const { activeDocument, caseId, stageId, documents } = this.props;
        return (
            <>
                {Array.isArray(documents) && documents.map(([groupName, groupedDocuments]) => (
                    <Fragment key={groupName}>
                        <h2 className='govuk-heading-m'>{groupName}</h2>
                        <dl className='govuk-summary-list'>
                            {
                                caseId && Array.isArray(groupedDocuments) && groupedDocuments.map(({ label, tags, value, hasPdf, hasOriginalFile }, i) => (
                                    <div key={i} className='govuk-summary-list__row'>
                                        <dd className='govuk-summary-list__value govuk-!-width-full'>
                                            {label}
                                        </dd>
                                        {Array.isArray(tags) && <dd className='govuk-summary-list__value govuk-!-width-one-quarter'>
                                            {tags.map(tag =>
                                                <strong key={tag} className='govuk-tag margin-right--small'>
                                                    {tag}
                                                </strong>
                                            )}
                                        </dd>
                                        }
                                        <dd className='govuk-summary-list__actions'>
                                            <ul className="govuk-summary-list__actions-list">
                                                {value && hasPdf && caseId && activeDocument !== value &&
                                                    <li className="govuk-summary-list__actions-list-item">
                                                        <a
                                                            id={`${value}-pdf`}
                                                            href={`/case/${caseId}/stage/${stageId}/download/document/${value}/pdf`}
                                                            className='govuk-link'
                                                            onClick={e => this._onClick(e, `${value}`)}
                                                        >
                                                            Preview
                                                        </a>
                                                    </li>
                                                }
                                                {value && hasOriginalFile && caseId &&
                                                    <li className="govuk-summary-list__actions-list-item">
                                                        <a
                                                            href={`/case/${caseId}/stage/${stageId}/download/document/${value}/original`}
                                                            className='govuk-link'
                                                            download={label}
                                                        >
                                                            Download
                                                        </a>
                                                    </li>
                                                }
                                            </ul>
                                        </dd>
                                    </div>
                                ))
                            }
                            {(!Array.isArray(groupedDocuments) || groupedDocuments.length === 0) && <div className='govuk-summary-list__row'>
                                <dd className='govuk-summary-list__value'>None</dd>
                            </div>}
                        </dl>
                    </Fragment>
                ))}
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
