import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../contexts/application.jsx';
import { unsetError, clearApiStatus } from '../contexts/actions/index.jsx';
import Error from './error.jsx';


class PageWrapper extends Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { track,
            error,
            match
        } = this.props;
        const nextPage = match.url;

        if (error && error.status) {
            track('PAGE_VIEW', { title: `Error: ${error.status}`, path: nextPage });
        }
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
    track: PropTypes.func.isRequired,
    error: PropTypes.object,
    match: PropTypes.object
};

const PageEnabledWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, error, track }) => (
            <PageWrapper
                {...props}
                dispatch={dispatch}
                track={track}
                error={error}
            />
        )}
    </ApplicationConsumer>
);

export default PageEnabledWrapper;
