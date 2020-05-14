import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import {
    setError,
    updateApiStatus,
    clearApiStatus,
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';

export class FlowDirectionLink extends Component {

    handleClick(e) {
        e.preventDefault();
        const { dispatch, history } = this.props;
        const endpoint = `/api/form/case/${this.props.caseId}/stage/${this.props.stageId}/direction/${this.props.flowDirection}`;
        return dispatch(updateApiStatus(status.FLOW_DIRECTION_LINK_REQUEST))
            .then(() => {
                axios.get(endpoint)
                    .then(response => {
                        if (response.data.errors) {
                            dispatch(updateApiStatus(status.FLOW_DIRECTION_LINK_FAILURE));
                        } else {
                            dispatch(updateApiStatus(status.FLOW_DIRECTION_LINK_SUCCESS));
                            history.push(response.data.redirect);
                        }
                    }).then(() => dispatch(clearApiStatus()));
            })
            .catch(error => {
                dispatch(updateApiStatus(status.FLOW_DIRECTION_LINK_FAILURE))
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
                    className={`govuk-body govuk-link${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    onClick={e => this.handleClick(e)}
                    to={action}
                >{label}</Link>
            </p>
        );
    }
}

FlowDirectionLink.propTypes = {
    caseId: PropTypes.string.isRequired,
    stageId: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string,
    history: PropTypes.object.isRequired,
    flowDirection: PropTypes.string.isRequired,
};

FlowDirectionLink.defaultProps = {
    disabled: false,
    label: 'Update'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <FlowDirectionLink {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

const FlowDirectionLinkWithRouter = withRouter(WrappedButton);

export default FlowDirectionLinkWithRouter;
