import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { cancel } from '../../contexts/actions/index.jsx';

class BackLink extends Component {

    handleClick(e) {
        e.preventDefault();
        this.props.dispatch(cancel());
    }

    render() {
        const {
            action,
            disabled,
            className,
            label
        } = this.props;
        return (
            <p>
                <Fragment>
                    <Link
                        className={`govuk-back-link${className ? ' ' + className : ''}`}
                        disabled={disabled}
                        to={action}
                        onClick={e => this.handleClick(e)}
                    >{label}</Link>
                </Fragment>
            </p>
        );
    }
}

BackLink.propTypes = {
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string
};

BackLink.defaultProps = {
    disabled: false,
    action: '/',
    label: 'Back'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <BackLink {...props} dispatch={dispatch}/>}
    </ApplicationConsumer>
);

export default WrappedButton;