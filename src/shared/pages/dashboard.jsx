import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateApiStatus,
    clearDashboard,
    clearApiStatus,
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Dashboard from '../common/components/dashboard-new.jsx';

class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = { dashboard: props.dashboard };
    }

    componentDidMount() {
        const { dashboard } = this.props;
        if (!dashboard) {
            return this.getDashboardData();
        }
        this.props.dispatch(clearDashboard());
    }

    getDashboardData() {
        const { dispatch } = this.props;
        return dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA))
            .then(() => {
                axios.get('/api/dashboard')
                    .then(response => {
                        dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA_SUCCESS))
                            .then(() => this.setState({ dashboard: response.data }))
                            .then(() => dispatch(clearApiStatus()))
                            .catch(() => {
                                dispatch(updateApiStatus(status.UPDATE_DASHBOARD_DATA_FAILURE));
                            });
                    })
                    .catch(() => {
                        dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA_FAILURE));
                    });
            });
    }

    render() {
        const { dashboard } = this.state;
        return (
            <Fragment>
                <h2 className='govuk-heading-l'>My work</h2>
                {dashboard && dashboard.user && <Dashboard dashboard={dashboard.user} absoluteUrl={'/workstack/user'} />}
                <h2 className='govuk-heading-l'>My teams work</h2>
                {dashboard && dashboard.teams && <Dashboard dashboard={dashboard.teams} baseUrl={'/workstack'} />}
            </Fragment>
        );
    }
}

DashboardPage.propTypes = {
    dashboard: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const WrappedPageDashboard = props => {
    return (
        <ApplicationConsumer>
            {({ dispatch, dashboard }) => (
                <DashboardPage
                    {...props}
                    dispatch={dispatch}
                    dashboard={dashboard}
                />
            )}
        </ApplicationConsumer>
    );
};

export default WrappedPageDashboard;