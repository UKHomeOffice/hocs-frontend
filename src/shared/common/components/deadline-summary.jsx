import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class DeadlineSummary extends Component {
    render() {
        const { deadlines } = this.props;
        return (
            <Fragment>
                <h2 className="govuk-heading-m">Deadlines</h2>
                {
                    deadlines && deadlines.map((deadline, i) => (
                        <table key={i} className="govuk-table">
                            <tbody className="govuk-table__body">
                                <tr className="govuk-table__row">
                                    <th className="govuk-table__header" scope="row">{deadline.type}</th>
                                    <td className="govuk-table__cell ">{deadline.date}</td>
                                </tr>
                            </tbody>
                        </table>
                    ))
                }
            </Fragment>
        );
    }
}

DeadlineSummary.propTypes = {
    deadlines: PropTypes.array.isRequired
};

export default DeadlineSummary;