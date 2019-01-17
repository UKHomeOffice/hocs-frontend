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
import Workstack from '../common/components/workstack-allocate.jsx';

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

    submitHandler(e) {
        e.preventDefault();
        console.log('ALLLOCATING');
        //submit the allocation form
    }

    updateFormData(update) {
        this.setState(state => ({ ...state, data: { ...state.data, ...update } }));
    }

    renderWorkstack() {
        const { match: { url } } = this.props;
        const { workstack = {} } = this.state;
        const { allocateToUserEndpoint, allocateToTeamEndpoint, allocateToWorkstackEndpoint, items, teamMembers } = workstack;
        return (
            <Fragment>
                <Workstack
                    baseUrl={url}
                    items={items}
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

    renderEmpty() {
        return (
            <span className='govuk-body'>Nothing to display</span>
        );
    }

    render() {
        const { workstack } = this.state;
        return (
            <div>
                {workstack ? this.renderWorkstack() : this.renderEmpty()}
            </div>
        );
    }

}

WorkstackPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    workstack: PropTypes.object.isRequired
}

export default (props) => (
    <ApplicationConsumer>
        {({ dispatch, workstack }) => (
            <WorkstackPage {...props} dispatch={dispatch} workstack={workstack} />
        )}
    </ApplicationConsumer>
)