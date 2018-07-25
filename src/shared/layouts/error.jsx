import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error extends Component {
    UNSAFE_componentWillMount() {
        const { staticContext } = this.props;
        if (staticContext) {
            staticContext.status = this.props.errorCode;
        }
    }

    render() {
        const {
            error,
            errorCode,
            location: { pathname },
            stack,
            title,
        } = this.props;

        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-l">
                        <span className="govuk-caption-l">{title}</span>
                        {`${error}`}
                    </h1>
                    {(errorCode === 403 || errorCode === 404) && pathname && <p><code>{pathname}</code></p>}
                    {stack &&
                        <details className="govuk-details" open={true}>
                            <summary className="govuk-details__summary">
                                <span className="govuk-details__summary-text">
                                    Stack trace
                                </span>
                            </summary>
                            <div className="govuk-details__text">
                                <pre className="code overflow-scroll">{stack}</pre>
                            </div>
                        </details>
                    }
                </div>
            </div>
        );
    }
}

Error.propTypes = {
    error: PropTypes.string,
    errorCode: PropTypes.number,
    location: PropTypes.object,
    stack: PropTypes.string,
    staticContext: PropTypes.object,
    title: PropTypes.string,
};

Error.defaultProps = {
    error: 'An error has occurred',
    errorCode: 500,
    location: { pathname: null },
    stack: null,
    title: 'Something has gone wrong'
};

export default Error;