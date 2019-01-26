import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ApplicationConsumer } from '../contexts/application.jsx';
import {
    updateApiStatus,
    clearDashboard,
    clearApiStatus,
} from '../contexts/actions/index.jsx';
import status from '../helpers/api-status.js';
import Dashboard from '../common/components/dashboard.jsx';

class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = { dashboard: props.dashboard };
    }

    componentDidMount() {
        const { dashboard, match, title, track } = this.props;
        if (!dashboard) {
            this.getDashboardData();
        }
        track('PAGE_VIEW', { title, path: match.url });
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
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h2 className='govuk-heading-m'>My Cases</h2>
                    {dashboard && dashboard.user && <Dashboard dashboard={dashboard.user} absoluteUrl={'/workstack/user'} alwaysLink={true} alwaysShow={false} />}
                    <h2 className='govuk-heading-m'>Team Cases</h2>
                    {dashboard && dashboard.teams && <Dashboard dashboard={dashboard.teams} baseUrl={'/workstack'} alwaysLink={true} alwaysShow={true} />}
                </div>
            </div>
        );
    }
}

DashboardPage.propTypes = {
    dashboard: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

const WrappedPageDashboard = props => {
    return (
        <ApplicationConsumer>
            {({ dispatch, dashboard, track }) => (
                <DashboardPage
                    {...props}
                    dispatch={dispatch}
                    track={track}
                    dashboard={dashboard}
                />
            )}
        </ApplicationConsumer>
    );
};

export default WrappedPageDashboard;