import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';
import DocumentPane from '../common/components/document-pane.jsx';

class Case extends Component {

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
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                        {title}
                    </h1>
                    {children}
                </div>
                <div className="govuk-grid-column-two-thirds">
                    <DocumentPane />
                </div>
            </div>
        );
    }
}

Case.propTypes = {
    children: PropTypes.node,
    form: PropTypes.object,
    title: PropTypes.string
};

export default formEnabled(Case);