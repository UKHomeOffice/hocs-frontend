import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhaseBanner from '../../common/components/phase-banner.jsx';
import Error from '../error.jsx';

class Body extends Component {
    render() {
        const {
            children,
            error,
            phaseBanner
        } = this.props;
        return (
            <div className="govuk-width-container">
                {phaseBanner.isVisible && <PhaseBanner {...phaseBanner} />}
                <main className="govuk-main-wrapper " id="main-content" role="main">
                    {error ? <Error {...error}/> : children}
                </main>
            </div>
        );
    }
}

Body.propTypes = {
    children: PropTypes.node,
    error: PropTypes.object,
    phaseBanner: PropTypes.object
};

Body.defaultProps = {
    phaseBanner: {
        isVisible: false
    }
};

export default Body;