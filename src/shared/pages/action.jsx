import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';

class Action extends Component {

    render() {
        const {
            children,
            subTitle,
            title
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                    <h1 className="govuk-heading-l">
                        {title}
                        {subTitle && <span className="govuk-caption-l">{subTitle}</span>}
                    </h1>
                    {children}
                </div>
            </div>
        );
    }
}

Action.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    subTitle: PropTypes.string
};

export default formEnabled(Action);