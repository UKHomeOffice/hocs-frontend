import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MappedText extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            choices,
            hint,
            label,
            name,
            value,
            error
        } = this.props;
        const mappings = new Map(choices.map(choice => [choice.value, choice.label]));
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <div className="govuk-hint">{hint}</div>}

                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                <output className="govuk-label govuk-label--s govuk-mapped-text"
                    id={name}
                    name={name}
                >
                    {mappings.get(value) ? mappings.get(value) : value}
                </output>
            </div>
        );
    }
}

MappedText.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    error: PropTypes.string,
};

MappedText.defaultProps = {
    choices: [],
    label: 'MappedText field',
    value: ''
};

export default MappedText;
