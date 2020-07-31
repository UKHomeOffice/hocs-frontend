import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ChangeLink extends Component{

    constructor(props) {
        super(props);

    }

    render() {
        const {
            target,
            label,
            name,
            data,
            changeValue
        } = this.props;

        const changeLabel = data[changeValue];

        return (
            <div className="govuk-form-group">
                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>
                    <label className="govuk-label" htmlFor={`${name}-changeLink`}>{changeLabel}</label>
                    <Link className="govuk-link" to={target} id={`${name}-changeLink`} >
                        Change
                    </Link>
                </fieldset>
            </div>
        );
    }
}

ChangeLink.propTypes = {
    target: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    changeValue: PropTypes.string,
    data: PropTypes.object,
    changeLabel: PropTypes.string
};

export default ChangeLink;
