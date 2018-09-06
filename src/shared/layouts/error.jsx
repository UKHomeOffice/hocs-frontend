import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error extends Component {
    UNSAFE_componentWillMount() {
        const { staticContext } = this.props;
        if (staticContext) {
            staticContext.status = this.props.status;
        }
    }

    buildParagraphs(body) {
        if (!body) return null;
        return body.map((paragraph, index) => {
            return <p key={index} className={'govuk-body'}>{paragraph}</p>;
        });
    }


    render() {
        const {
            title,
            status,
            location: { pathname },
            stack,
            body,
            message,
        } = this.props;

        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-xl">
                        {message && <span className="govuk-caption-xl">{message}</span>}
                        {`${title}`}
                    </h1>

                    {this.buildParagraphs(body)}
                    {(status === 403 || status === 404) && pathname && <p><code className="code">{pathname}</code></p>}
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
    message: PropTypes.string,
    status: PropTypes.number,
    location: PropTypes.object,
    stack: PropTypes.string,
    body: PropTypes.arrayOf(PropTypes.string),
    staticContext: PropTypes.object,
    title: PropTypes.string,
};

Error.defaultProps = {
    status: 500,
    location: { pathname: null },
    stack: null,
    title: 'Something has gone wrong'
};

export default Error;