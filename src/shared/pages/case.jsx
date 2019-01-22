import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';

class Case extends Component {

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
                        {title}
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                    </h1>
                    {children}
                </div>
            </div>
        );
    }
}

Case.defaultProps = {
    hasDocPreview : true
};

Case.propTypes = {
    children: PropTypes.node,
    form: PropTypes.object,
    title: PropTypes.string,
    hasDocPreview : PropTypes.bool
};

export default formEnabled(Case);