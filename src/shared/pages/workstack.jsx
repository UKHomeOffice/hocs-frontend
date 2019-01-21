import React, { Component, Fragment } from 'react';
import { ApplicationConsumer } from '../contexts/application.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    clearWorkstack,
    updateApiStatus,
    clearApiStatus
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Workstack from '../common/components/workstack.jsx';
import Dashboard from '../common/components/dashboard.jsx';

class WorkstackPage extends Component {

    constructor(props) {
        super(props);
        this.state = { workstack: props.workstack, formData: {} };
    }

    componentDidMount() {
        const { workstack } = this.state;
        const { dispatch } = this.props;

        if (!workstack) {
            this.getWorkstack();
        }

        dispatch(clearWorkstack());
    }

    getWorkstack() {
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

    submitHandler(e, endpoint) {
        e.preventDefault();
        const { formData } = this.state;
        // TODO: Remove
        /* eslint-disable-next-line no-undef */
        const payload = new FormData();
        Object.keys(formData).forEach(field => {
            if (Array.isArray(formData[field])) {
                formData[field].map(value => {
                    payload.append(`${field}`, value);
                });
            } else {
                payload.append(field, formData[field]);
            }
        });
        axios.post('/api' + endpoint, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(({ data: { workstack } }) => this.setState({ workstack }));
    }

    updateFormData(update) {
        this.setState(state => ({ ...state, formData: { ...state.formData, ...update } }));
    }

    renderDashboard() {
        const { match: { url } } = this.props;
        const { workstack } = this.state;
        return (
            <Fragment>
                <Dashboard dashboard={workstack.dashboard} baseUrl={url} />
            </Fragment>
        );
    }

    renderWorkstack() {
        const { match: { url } } = this.props;
        const { workstack, formData } = this.state;
        const { allocateToUserEndpoint, allocateToTeamEndpoint, allocateToWorkstackEndpoint, items, teamMembers } = workstack;
        return (
            <Fragment>
                <Workstack
                    baseUrl={url}
                    items={items}
                    selectedCases={formData['selected_cases']}
                    teamMembers={teamMembers}
                    allocateToUserEndpoint={allocateToUserEndpoint}
                    allocateToTeamEndpoint={allocateToTeamEndpoint}
                    allocateToWorkstackEndpoint={allocateToWorkstackEndpoint}
                    submitHandler={this.submitHandler.bind(this)}
                    updateFormData={this.updateFormData.bind(this)}
                />
            </Fragment>
        );
    }

    render() {
        const { workstack } = this.state;
        return (
            <div>
                {workstack && workstack.dashboard ? this.renderDashboard() : null}
                {workstack && workstack.items ? this.renderWorkstack() : null}
            </div>
        );
    }

}

WorkstackPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    workstack: PropTypes.object
};

const WrappedWorkstack = (props) => (
    <ApplicationConsumer>
        {({ dispatch, workstack }) => (
            <WorkstackPage {...props} dispatch={dispatch} workstack={workstack} />
        )}
    </ApplicationConsumer>
);

export default WrappedWorkstack;