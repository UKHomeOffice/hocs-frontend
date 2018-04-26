import React, { Component, Fragment } from 'react';

class Error extends Component {
    componentWillMount() {
        const { staticContext } = this.props;
        if (staticContext) {
            staticContext.status = 404;
        }
    }

    render() {
        const {
            title,
            error,
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
                    {pathname ?
                        <p className="code">{pathname}</p>
                        : null
                    }
                    {stack ?
                        <p className="code overflow-scroll">{stack}</p>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Error;