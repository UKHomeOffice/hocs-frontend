import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class StageSummary extends Component {
    render() {
        const { stages } = this.props;
        return (
            <Fragment>
                <h2 className="govuk-heading-m">Stages</h2>
                {
                    stages && stages.map((stage, i) => (
                        <table key={i} className="govuk-table">
                            <caption className="govuk-table__caption">{stage.type}</caption>
                            <tbody className="govuk-table__body">
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">UUID</th>
                                    <td className="govuk-table__cell ">{stage.uuid}</td>
                                </tr>
                                {
                                    stage.data && Object.entries(JSON.parse(stage.data)).map(([field, value], i) => (
                                        <tr key={i} className="govuk-table__row">
                                            <th className="govuk-table__header" scope="row">{field}</th>
                                            <td className="govuk-table__cell ">{value}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ))
                }
            </Fragment>
        );
    }
}

StageSummary.propTypes = {
    stages: PropTypes.array.isRequired
};

export default StageSummary;