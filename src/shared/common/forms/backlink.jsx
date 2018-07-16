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
            to,
            className,
            label
        } = this.props;
        return (
            <p>
                <Fragment>
                    <Link
                        className={`govuk-back-link ${className ? ' ' + className : ''}`}
                        to={to}
                        onClick={e => this.handleClick(e)}
                    >{label}</Link>

                </Fragment>
            </p>
        );
    }
}

BackLink.propTypes = {
    to: PropTypes.string.isRequired,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string
};

BackLink.defaultProps = {
    disabled: false,
    to: '/',
    label: 'Back'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <BackLink {...props} dispatch={dispatch}/>}
    </ApplicationConsumer>
);

export default WrappedButton;