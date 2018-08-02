import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class CaseDetailsSummary extends Component {
    render() {
        const { type, timestamp, uuid } = this.props;
        return (
            <Fragment>
                <h2 className="govuk-heading-m">Details</h2>
                <table className="govuk-table">
                    <tbody className="govuk-table__body">
                        {type && <tr className="govuk-table__row">
                            <th className="govuk-table__header" scope="row">Type</th>
                            <td className="govuk-table__cell ">{type}</td>
                        </tr>}
                        {timestamp && <tr className="govuk-table__row">
                            <th className="govuk-table__header" scope="row">Created</th>
                            <td className="govuk-table__cell ">{timestamp}</td>
                        </tr>}
                        {uuid && <tr className="govuk-table__row">
                            <th className="govuk-table__header" scope="row">UUID</th>
                            <td className="govuk-table__cell ">{uuid}</td>
                        </tr>}
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

CaseDetailsSummary.propTypes = {
    type: PropTypes.string,
    uuid: PropTypes.string,
    timestamp: PropTypes.string
};

export default CaseDetailsSummary;