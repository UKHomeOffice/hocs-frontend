import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConfirmationWithCaseRef extends Component {

    render() {

        const {
            label,
            caseRef
        } = this.props;

        return (
            <div className="govuk-panel govuk-panel--confirmation">
                <div className="govuk-panel__body">Case number: {caseRef} {label}
                </div>
            </div>
        );
    }
}

ConfirmationWithCaseRef.propTypes = {
    label: PropTypes.string,
    caseRef: PropTypes.string
};