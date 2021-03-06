import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';
import SideBar from '../common/components/side-bar.jsx';

class Stage extends Component {

    render() {
        const {
            children,
            form,
            title
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                    <h1 className="govuk-heading-l">
                        {title}
                        {form && <span className="govuk-caption-l">{form.caseReference}</span>}
                    </h1>
                    {children}
                </div>
                <div className="govuk-grid-column-two-thirds">
                    <SideBar />
                </div>
            </div>
        );
    }
}

Stage.propTypes = {
    children: PropTypes.node,
    form: PropTypes.object,
    title: PropTypes.string
};

export default formEnabled(Stage);