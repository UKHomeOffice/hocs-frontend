import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorSummary extends Component {

    render() {
        const {
            description,
            errors,
            heading
        } = this.props;
        return (
            <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex="-1">

                <h2 className="govuk-error-summary__title" id="error-summary-heading-example-1">
                    {heading}
                </h2>
                <div className="govuk-error-summary__body">
                    {description && <p>
                        {description}
                    </p>}

                    <ul className="govuk-list govuk-error-summary__list">
                        {Object.entries(errors).map(error => {
                            return (
                                <li key={error[0]}>
                                    <a href={`#${error[0]}`}>{error[1]}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

ErrorSummary.propTypes = {
    description: PropTypes.string,
    errors: PropTypes.object,
    heading: PropTypes.string
};

ErrorSummary.defaultProps = {
    heading: 'Please fix the following errors',
    description: null,
    errors: {}
};

export default ErrorSummary;