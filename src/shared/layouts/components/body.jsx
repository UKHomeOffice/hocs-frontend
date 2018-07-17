import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhaseBanner from '../../common/components/phase-banner.jsx';

class Body extends Component {
    render() {
        const {
            children,
            phaseBanner
        } = this.props;
        return (
            <div className="govuk-width-container">
                {phaseBanner.isVisible && <PhaseBanner {...phaseBanner} />}
                <main className="govuk-main-wrapper " id="main-content" role="main">
                    {children}
                </main>
            </div>
        );
    }
}

Body.propTypes = {
    children: PropTypes.node,
    phaseBanner: PropTypes.object
};

Body.defaultProps = {
    phaseBanner: {
        isVisible: false
    }
};

export default Body;