import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PhaseBannerComponent extends Component {
    render() {
        const { feedback, phase } = this.props;

        return (
            <div className="phase-banner">
                <p>
                    <strong className="phase-tag">{phase}</strong>
                    <span>This is a new service – your <a
                        href={feedback}>feedback</a> will help us to improve it.</span>
                </p>
            </div>
        );
    }
}

PhaseBannerComponent.propTypes = {
    feedback: PropTypes.string,
    phase: PropTypes.string
};

PhaseBannerComponent.defaultProps = {
    feedback: '/',
    phase: 'PROTOTYPE'
};