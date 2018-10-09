import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateWorkstack,
    clearWorkstack,
    updateApiStatus,
    clearApiStatus
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Workstack from '../common/components/workstack.jsx';

class WorkstackPage extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    componentDidMount() {
        if (!this.props.workstack) {
            this.getWorkstackData();
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        return dispatch(clearWorkstack());
    }

    getWorkstackData() {
        const { dispatch, match: { url } } = this.props;
        const endpoint = '/api' + url;
        return dispatch(updateApiStatus(status.REQUEST_WORKSTACK_DATA))
            .then(() => {
                axios.get(endpoint)
                    .then(response => {
                        dispatch(updateApiStatus(status.REQUEST_WORKSTACK_DATA_SUCCESS))
                            .then(() => dispatch(updateWorkstack(response.data)))
                            .then(() => dispatch(clearApiStatus()))
                            .catch(() => {
                                dispatch(updateApiStatus(status.UPDATE_WORKSTACK_DATA_FAILURE));
                            });
                    })
                    .catch(() => {
                        dispatch(updateApiStatus(status.REQUEST_WORKSTACK_DATA_FAILURE));
                    });
            });
    }

    renderWorkstack(workstack) {
        return (
            <Fragment>
                <h1 className="govuk-heading-l">
                    {workstack.label}
                </h1>
                <Workstack workstack={workstack.items} />
            </Fragment>
        );
    }

    render() {
        const { workstack } = this.props;
        return (
            <Fragment>
                {workstack ? this.renderWorkstack(workstack) : <p className='govuk-body'> No workstack data </p>}
            </Fragment>
        );
    }
}

WorkstackPage.propTypes = {
    workstack: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
};

const WrappedWorkstackPage = props => {
    return (
        <ApplicationConsumer>
            {({ dispatch, workstack }) => (
                <WorkstackPage
                    {...props}
                    dispatch={dispatch}
                    workstack={workstack}
                />
            )}
        </ApplicationConsumer>
    );
};

export default WrappedWorkstackPage;