import React, {Component} from "react";

class ErrorSummary extends Component {

    render() {
        const {
            heading,
            description,
            errors
        } = this.props;
        return (
            <div className="error-summary" role="alert" aria-labelledby="error-summary-heading-example-1" tabIndex="-1">

                <h2 className="heading-medium error-summary-heading" id="error-summary-heading-example-1">
                    {heading}
                </h2>

                {description && <p>
                    {description}
                </p>}

                <ul className="error-summary-list">
                    {Object.entries(errors).map(error => {
                        return (
                            <li key={error[0]}>
                                <a href={`#${error[0]}`}>{error[1]}</a>
                            </li>
                        );
                    })}
                </ul>

            </div>
        )
    }
}

ErrorSummary.defaultProps = {
    heading: 'Please fix the following errors',
    description: null,
    errors: {}
};

export default ErrorSummary;