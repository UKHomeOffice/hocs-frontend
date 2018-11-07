import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';
import Ribbon from '../common/forms/ribbon.jsx';
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
                <div className="govuk-grid-column-one-half">
                    <h1 className="govuk-heading-l">
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                        {title}
                    </h1>
                    <Ribbon title='Allocation Note'>
                        <p> You just sort of have to make almighty decisions. Just leave that space open. Let's start with an almighty sky here. </p>
                    </Ribbon>
                    {children}
                </div>
                <div className="govuk-grid-column-one-half">
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