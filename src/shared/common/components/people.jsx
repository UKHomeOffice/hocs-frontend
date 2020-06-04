import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCaseSummary,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import PropTypes from 'prop-types';

class PeopleSummary extends Component {

    constructor(props) {
        super(props);
        this.state = { summary: props.people };
    }

    componentDidMount() {
        const { people, dispatch } = this.props;
        if (!people) {
            this.getSummary();
        }
        dispatch(unsetCaseSummary());
    }

    getSummary() {
        const { page, dispatch } = this.props;
        if (page && page.params && page.params.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/correspondents`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    this.setState({
                                        people: response.data
                                    });
                                });
                        });
                })
                .catch(() => {
                    dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_FAILURE))
                        .then(() => clearInterval(this.interval));
                });
        }
    }



    render() {
        const { people } = this.state;
        console.log(people);
        return ("jd");
    }
}

PeopleSummary.propTypes = {
    dispatch: PropTypes.func.isRequired,
    people: PropTypes.object,
    page: PropTypes.object
};

const WrappedPeopleSummary = props => (
    <ApplicationConsumer>
        {({ dispatch, people, page }) => <PeopleSummary {...props} dispatch={dispatch} people={people} page={page}/>}
    </ApplicationConsumer>
);

export default WrappedPeopleSummary;