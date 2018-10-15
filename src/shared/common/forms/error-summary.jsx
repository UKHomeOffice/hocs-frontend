import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorSummary extends Component {

    scrollInToView(e, link) {
        e.preventDefault();
        /* eslint-disable-next-line no-undef */
        const element = document.getElementById(link);
        if (element) {
            element.scrollIntoView();
        }
    }

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
                        {Object.entries(errors).map(([key, value]) => {
                            const link = `${key}-error`;
                            return (
                                <li key={key}>
                                    <a href={`#${link}`} onClick={(e) => this.scrollInToView(e, link)} >{value}</a>
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
    heading: 'There’s a problem',
    description: null,
    errors: {}
};

export default ErrorSummary;