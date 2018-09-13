import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class BackLink extends Component {

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
                    to={action}
                >{label}</Link>
            </p>
        );
    }
}

BackLink.propTypes = {
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string
};

BackLink.defaultProps = {
    disabled: false,
    action: '/',
    label: 'Back'
};

export default BackLink;