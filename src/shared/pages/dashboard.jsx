import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateApiStatus,
    updateDashboard,
    clearDashboard,
    clearApiStatus,
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Dashboard from '../common/components/dashboard.jsx';

class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    componentDidMount() {
        if (!this.props.dashboard) {
            this.getDashboardData();
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        return dispatch(clearDashboard());
    }

    getDashboardData() {
        const { dispatch } = this.props;
        return dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA))
            .then(() => {
                axios.get('/api/dashboard')
                    .then(response => {
                        dispatch(updateApiStatus(status.REQUEST_DASHBOARD_DATA_SUCCESS))
                            .then(() => dispatch(updateDashboard(response.data)))
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
        const { dashboard } = this.props;
        return (
            <Fragment>
                {dashboard ? <Dashboard dashboard={dashboard} /> : <p className='govuk-body'> No dashboard data </p>}
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