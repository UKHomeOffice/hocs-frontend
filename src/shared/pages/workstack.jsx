import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    clearWorkstack,
    updateApiStatus,
    clearApiStatus
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Workstack from '../common/components/workstack-allocate.jsx';
import Dashboard from '../common/components/dashboard-new.jsx';

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

    renderWorkstack() {
        const { workstack } = this.state;
        return (
            <Fragment>
                <Workstack {...workstack} />
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

    renderBreadCrumb(items) {
        return (<Breadcrumbs items={items} />);
    }

    render() {
        const { workstack } = this.state;
        return (
            <Fragment>
                {workstack ?
                    <Fragment>
                        {workstack.breadcrumbs && this.renderBreadCrumb(workstack.breadcrumbs)}
                        <h1 className="govuk-heading-l">
                            {workstack.label}
                        </h1>
                        {workstack.dashboard && this.renderDashboard(workstack.dashboard)}
                        {this.renderWorkstack()}
                    </Fragment>
                    : null
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