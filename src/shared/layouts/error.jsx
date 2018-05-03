import React, { Component, Fragment } from 'react';

class Error extends Component {
    componentWillMount() {
        const { staticContext } = this.props;
        if (staticContext) {
            staticContext.status = this.props.errorCode;
        }
    }

    render() {
        const {
            title,
            error,
            errorCode,
            stack,
            location: { pathname }
        } = this.props;

        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-xlarge">                        
                        {`${error}`}
                        <span className="heading-secondary">{title}</span>
                    </h1>
                    {errorCode === 404 && pathname && <p className="code">{pathname}</p>}
                    {stack && <p className="code overflow-scroll">{stack}</p>}
                </div>
            </div>
        )
    }
}

Error.defaultProps = {
    title: 'Something has gone wrong',
    error: 'An error has occurred',
    errorCode: 500,
    stack: null,
    location: {
        pathname: null
    }
};

export default Error;