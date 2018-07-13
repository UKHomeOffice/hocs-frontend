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
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-large">
                        {`${error}`}
                        <span className="heading-secondary">{title}</span>
                    </h1>
                    {(errorCode === 403 || errorCode === 404) && pathname && <p className="code">{pathname}</p>}
                    {stack && <p className="code overflow-scroll">{stack}</p>}
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