import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';
import SideBar from '../common/components/side-bar.jsx';

class Case extends Component {

    render() {
        const {
            children,
            hasSidebar,
            form,
            title
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className={`govuk-grid-column-one-${hasSidebar ? 'third' : 'half'}`}>
                    {title && <h1 className="govuk-heading-l">
                        {title}
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                    </h1>}
                    {children}
                </div>
                {hasSidebar && <div className="govuk-grid-column-two-thirds">
                    <SideBar />
                </div>}
            </div>
        );
    }
}

Case.defaultProps = {
    hasSidebar: false
};

Case.propTypes = {
    children: PropTypes.node,
    form: PropTypes.object,
    title: PropTypes.string,
    hasSidebar: PropTypes.bool
};

export default formEnabled(Case);