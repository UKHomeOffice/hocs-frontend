import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class Submit extends Component {
    render() {
        const {
            className,
            disabled,
            label,
            name,
            callback = (arg) => arg
        } = this.props;
        return (
            <Fragment>
                <input
                    className={`govuk-button${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    type="submit"
                    value={label}
                    name={name}
                    onClick={() => callback( { submitAction: name } )}
                />
            </Fragment>
        );
    }
}

Submit.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    callback: PropTypes.func
};

Submit.defaultProps = {
    disabled: false,
    label: 'Submit'
};

export default Submit;
