import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
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

const renderBreadCrumb = ({ key, label, to, isLast }) => (
    <li key={key} className='govuk-breadcrumbs__list-item'>
        {isLast ? label : <Link className='govuk-breadcrumbs__link' to={to}>{label}</Link>}
    </li>
);

renderBreadCrumb.propTypes = {
    key: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    isLast: PropTypes.bool.isRequired
};

const Breadcrumbs = ({ items }) => (
    <div className='govuk-breadcrumbs'>
        <ol className='govuk-breadcrumbs__list'>
            {items.map((item, i) => renderBreadCrumb({ ...item, key: i, isLast: (items.length > 1 && i === (items.length - 1)) }))}
        </ol>
    </div>
);

Breadcrumbs.propTypes = {
    items: PropTypes.array.isRequired
};

class WorkstackPage extends Component {

    constructor(props) {
        super(props);
        this.state = { workstack: props.workstack, formData: {} };
    }

    componentDidMount() {
        const { workstack } = this.state;
        const { dispatch, track, title, match } = this.props;

        if (!workstack) {
            this.getWorkstack();
        }

        track('PAGE_VIEW', { title, path: match.url });
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
        const { formData, workstack } = this.state;
        const { track, title, match } = this.props;
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
            .then(({ data: { workstack } }) => this.setState({ workstack }))
            .then(() => endpoint === match.url + workstack.allocateToUserEndpoint ? 'Allocate to self' : endpoint === match.url + workstack.allocateToTeamEndpoint ? 'Allocate to team member' : 'Unallocate')
            .then(label => track('EVENT', { category: title, action: 'Submit', label }));
    }

    updateFormData(update) {
        this.setState(state => ({ ...state, formData: { ...state.formData, ...update } }));
    }

    renderBreadCrumb(items) {
        return (<Breadcrumbs items={items} />);
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
        const { match: { url }, selectable = true } = this.props;
        const { workstack, formData } = this.state;
        const { allocateToUserEndpoint, allocateToTeamEndpoint, allocateToWorkstackEndpoint, items, teamMembers } = workstack;
        return (
            <Fragment>
                <Workstack
                    baseUrl={url}
                    items={items}
                    selectable={selectable}
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
        const { title } = this.props;
        const { workstack } = this.state;
        return (
            <div>
                {workstack && workstack.breadcrumbs ? this.renderBreadCrumb(workstack.breadcrumbs) : null}
                <h1 className="govuk-heading-l">
                    {title}
                </h1>
                {workstack && workstack.dashboard ? this.renderDashboard() : null}
                {workstack && workstack.items ? this.renderWorkstack() : null}
            </div>
        );
    }

}

WorkstackPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    workstack: PropTypes.object,
    track: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    selectable: PropTypes.bool
};

const WrappedWorkstack = (props) => (
    <ApplicationConsumer>
        {({ dispatch, track, workstack }) => (
            <WorkstackPage {...props} track={track} dispatch={dispatch} workstack={workstack} />
        )}
    </ApplicationConsumer>
);

export default WrappedWorkstack;