import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PhaseBannerComponent extends Component {
    render() {
        const { feedback, phase, environment } = this.props;

        var envDisplay;

        if (environment === 'NOTPROD') {
            envDisplay = <>This is a test system - do not upload real documents or information</>;
        } else {
            envDisplay = <>This is a new service – your <a href={feedback}>feedback</a> will help us to improve it.</>;
        }

        return (
            <div className="govuk-phase-banner">
                <p className="govuk-phase-banner__content">
                    <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
                    <span>{envDisplay}</span>
                </p>
            </div>
        );
    }
}

PhaseBannerComponent.propTypes = {
    feedback: PropTypes.string,
    phase: PropTypes.string,
    environment: PropTypes.string
};

PhaseBannerComponent.defaultProps = {
    feedback: '/',
    phase: 'PROTOTYPE',
    environment: ''
};