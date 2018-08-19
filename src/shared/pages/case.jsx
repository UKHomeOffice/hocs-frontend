import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Case extends Component {

    render() {
        const {
            children,
            form,
            title
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-l">
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                        {title}
                    </h1>
                    {children}
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

export default Case;