import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class DocumentSummary extends Component {
    render() {
        const { documents } = this.props;
        return (
            <Fragment>
                <h2 className="govuk-heading-m">Documents</h2>
                {
                    documents && documents.map((document, i) => (
                        <table key={i} className="govuk-table">
                            <caption className="govuk-table__caption">{document.name}</caption>
                            <tbody className="govuk-table__body">
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">UUID</th>
                                    <td className="govuk-table__cell ">{document.uuid}</td>
                                </tr>
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">Type</th>
                                    <td className="govuk-table__cell ">{document.type}</td>
                                </tr>
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">Status</th>
                                    <td className="govuk-table__cell ">{document.status}</td>
                                </tr>
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">Date added</th>
                                    <td className="govuk-table__cell ">{document.created}</td>
                                </tr>
                            </tbody>
                        </table>
                    ))
                }
            </Fragment>
        );
    }
}

DocumentSummary.propTypes = {
    documents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DocumentSummary;