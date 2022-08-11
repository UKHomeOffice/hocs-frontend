import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class BackLink extends Component {

    calculateTo() {
        const { action, page: { caseId, stageId } } = this.props;

        if (action) {
            return action;
        } else if (caseId && stageId) {
            return `/case/${caseId}/stage/${stageId}`;
        }

        return '/';
    }

    render() {
        const {
            className,
            disabled,
            label
        } = this.props;

        return (
            <p>
                <Link
                    className={`govuk-back-link${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    to={this.calculateTo()}
                >{label}</Link>
            </p>
        );
    }
}

BackLink.propTypes = {
    action: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    page: PropTypes.object
};

BackLink.defaultProps = {
    disabled: false,
    label: 'Back',
    page: {}
};

export default BackLink;
