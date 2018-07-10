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
            <main id="content">
                {phaseBanner.isVisible && <PhaseBanner {...phaseBanner} />}
                {children}
            </main>
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