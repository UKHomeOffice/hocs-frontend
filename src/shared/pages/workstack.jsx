import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    clearWorkstack,
    updateApiStatus,
    clearApiStatus
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Workstack from '../common/components/workstack.jsx';
import Dashboard from '../common/components/dashboard-new.jsx';

class WorkstackPage extends Component {

    constructor(props) {
        super(props);
        this.state = { workstack: props.workstack };
    }

    componentDidMount() {
        const { dispatch, workstack } = this.props;
        if (!workstack) {
            return this.getWorkstackData();
        }
        dispatch(clearWorkstack());
    }

    getWorkstackData() {
        const { dispatch, match: { url } } = this.props;
        const endpoint = '/api' + url;
        return dispatch(updateApiStatus(status.REQUEST_WORKSTACK_DATA))
            .then(() => {
                axios.get(endpoint)
                    .then(response => {
                        dispatch(updateApiStatus(status.REQUEST_WORKSTACK_DATA_SUCCESS))
                            .then(() => this.setState({ workstack: response.data }))
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
                <Workstack workstack={workstack} />
            </Fragment>
        );
    }

    renderDashboard(dashboard) {
        const { match: { url } } = this.props;
        return (
            <Fragment>
                <Dashboard dashboard={dashboard} baseUrl={url} />
            </Fragment>
        );
    }

    render() {
        const { workstack } = this.state;
        return (
            <Fragment>
                {workstack ?
                    <Fragment>
                        <h1 className="govuk-heading-l">
                            {workstack.label}
                        </h1>
                        {workstack.dashboard && this.renderDashboard(workstack.dashboard)}
                        {this.renderWorkstack(workstack.items)}
                    </Fragment>
                    : <p className='govuk-body'>No items to display</p>
                }
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
            {({ dispatch, workstack, ref }) => (
                <WorkstackPage
                    {...props}
                    ref={ref}
                    dispatch={dispatch}
                    workstack={workstack}
                />
            )}
        </ApplicationConsumer>
    );
};

export default WrappedWorkstackPage;