import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../contexts/application.jsx';
import { unsetError, clearApiStatus } from '../contexts/actions/index.jsx';
import Error from './error.jsx';
import withRouter from '../router/withRouter';

class PageWrapper extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        const { dispatch, error } = this.props;
        if (error) {
            dispatch(unsetError()).then(() => dispatch(clearApiStatus()));
        }
    }

    render() {
        const { children, error } = this.props;
        return (
            <Fragment>
                {error ? <Error error={error} /> : children}
            </Fragment>
        );
    }
}

PageWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    match: PropTypes.object
};

const PageEnabledWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, error }) => (
            <PageWrapper
                {...props}
                dispatch={dispatch}
                error={error}
            />
        )}
    </ApplicationConsumer>
);

export default withRouter(PageEnabledWrapper);
