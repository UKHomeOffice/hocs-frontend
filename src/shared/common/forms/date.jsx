import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DateInput extends Component {

    constructor(props) {
        super(props);
    }

    _onChange(field, value) {
        const updatedPart = { [field]: value };
        const parts = { ...this.parseValue(this.props.value), ...updatedPart };
        this.props.updateState({ [this.props.name]: `${parts.year}-${parts.month}-${parts.day}` });
    }

    datePart(field) { return `${this.props.name}-${field}`; }

    parseValue(value) {
        const [year = '', month = '', day = ''] = (value || '').split('-');
        return {
            day,
            month,
            year
        };
    }

    render() {
        const {
            name,
            disabled,
            error,
            hint,
            label,
            minYear,
            maxYear = new Date().getFullYear() + 100,
            value,
            autopopulate
        } = this.props;
        const yearKey = this.datePart('year');
        const monthKey = this.datePart('month');
        const dayKey = this.datePart('day');
        let parts;
        if(!value && autopopulate){
            parts = this.parseValue(new Date().toISOString().substr(0, 10));
            this.props.updateState({ [this.props.name]: `${parts.year}-${parts.month}-${parts.day}` });
        }
        else{
            parts = this.parseValue(value);
        }

        return <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <fieldset id={name} disabled={disabled} className="govuk-fieldset" role="group">
                <legend className="govuk-fieldset__legend govuk-label--s">{label}</legend>
                {hint && <div className="govuk-hint">{hint}</div>}
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                <div className="govuk-date-input">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={dayKey}>Day</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={dayKey}
                                name={dayKey}
                                type="text"
                                inputMode="numeric"
                                min="1"
                                max="31"
                                value={parts.day}
                                onChange={e => {this._onChange('day', e.target.value);}}
                            />
                        </div>
                    </div>
                    <div className='govuk-date-input__item'>
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={monthKey}>Month</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={monthKey}
                                name={monthKey}
                                type="text"
                                inputMode="numeric"
                                min="1"
                                max="12"
                                value={parts.month}
                                onChange={e => {this._onChange('month', e.target.value);}}
                            />
                        </div>
                    </div>
                    <div className='govuk-date-input__item'>
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={yearKey}>Year</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-4  ${error ? 'govuk-input--error' : ''}`}
                                id={yearKey}
                                name={yearKey}
                                type="text"
                                inputMode="numeric"
                                min={minYear}
                                max={maxYear}
                                value={parts.year}
                                onChange={e => {this._onChange('year', e.target.value);}}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>;
    }
}

DateInput.propTypes = {
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxYear: PropTypes.number,
    minYear: PropTypes.number,
    autopopulate: PropTypes.bool
};

DateInput.defaultProps = {
    disabled: false,
    value: '',
    minYear: 1900
};

export default DateInput;
