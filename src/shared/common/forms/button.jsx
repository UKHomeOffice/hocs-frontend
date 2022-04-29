import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { cancel } from '../../contexts/actions/index.jsx';

class Button extends Component {

    handleClick(e, preventDefault) {
        if(preventDefault === 'true') {
            e.preventDefault();
        }

        this.props.dispatch(cancel());
    }

    render() {
        const {
            action,
            className,
            disabled,
            label,
            preventDefault
        } = this.props;
        return (
            <Fragment>
                <Link
                    className={`govuk-button${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    to={action}
                    onClick={e => this.handleClick(e, preventDefault)}
                >{label}</Link>
            </Fragment>
        );
    }
}

Button.propTypes = {
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string,
    preventDefault: PropTypes.string
};

Button.defaultProps = {
    disabled: false,
    preventDefault: 'true',
    label: 'Submit'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <Button {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

export { WrappedButton, Button };
