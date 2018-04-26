import React, { Component } from 'react';
import PhaseBanner from '../../common/components/phase-banner.jsx';

class Body extends Component {
    render() {
        const {
            phaseBanner,
            children
        } = this.props;
        return (
            <main id="content">
                {phaseBanner.isVisible ? <PhaseBanner {...phaseBanner} /> : null}
                {children}
            </main>
        );
    }
}

Body.defaultProps = {
    phaseBanner: {
        isVisible: false
    }
};

export default Body;