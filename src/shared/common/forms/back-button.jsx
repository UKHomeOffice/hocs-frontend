import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


export class BackButton extends Component {

    render() {
        const {
            action,
            className,
            disabled,
            label,
            switchDirection
        } = this.props;
        return (
            <p>
                <Link
                    className={`govuk-back-link${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    onClick={e => switchDirection(e, 'BACKWARD')}
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
    history: PropTypes.object.isRequired,
    switchDirection: PropTypes.func
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
