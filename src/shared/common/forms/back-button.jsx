import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router';
import {
    setError,
    updateApiStatus,
    clearApiStatus,
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';

export class BackButton extends Component {

    handleClick(e) {
        e.preventDefault();
        const { dispatch, history } = this.props;
        const endpoint = `/api/form/case/${this.props.caseId}/stage/${this.props.stageId}/back`;
        return dispatch(updateApiStatus(status.MOVE_BACK_REQUEST))
            .then(() => {
                axios.get(endpoint)
                    .then(response => {
                        if (response.data.errors) {
                            dispatch(updateApiStatus(status.MOVE_BACK_FAILURE));
                        } else {
                            dispatch(updateApiStatus(status.MOVE_BACK_SUCCESS));
                            history.push(response.data.redirect);
                        }
                    }).then(() => dispatch(clearApiStatus()));
            })
            .catch(error => {
                dispatch(updateApiStatus(status.MOVE_BACK_FAILURE))
                    .then(() => dispatch(setError(error.response)));
            });
    }

    render() {
        const {
            action,
            className,
            disabled,
            label
        } = this.props;
        return (
            <p>
                <Link
                    className={`govuk-back-link${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    onClick={e => this.handleClick(e)}
                    to={action}
                >{label}</Link>
            </p>
        );
    }
}

BackButton.propTypes = {
    caseId: PropTypes.string.isRequired,
    stageId: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string,
    history: PropTypes.object.isRequired
};

BackButton.defaultProps = {
    disabled: false,
    label: 'Submit'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <BackButton {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

const BackButtonWithRouter = withRouter(WrappedButton);

export default BackButtonWithRouter;