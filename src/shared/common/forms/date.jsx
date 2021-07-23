import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DateInput extends Component {

    constructor(props) {
        super(props);
    }

    _onChange(field, value) {
        const updatedPart = { [field]: value };
        const parts = { ...this.parseValue(this.props.value), ...updatedPart };
        this.props.updateState({ [this.props.name]: `${parts.year}-${this.sanitiseDayMonthPart(parts.month)}-${this.sanitiseDayMonthPart(parts.day)}` });
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

    /**
     * Dates that have leading zeros in a part are typically invalid and fail on a `new Date` or
     * Javas `LocalDate.parse`. Those dates that are obvious i.e. single digit 1-9 in the right
     * most character with any number of 0's before are clear so we can sanitise these and leave 
     * only one zero pre-pended.
     *
     * We pad the resultant with the correct amount of 0's for the part of the date, as this allows
     * Java's `LocalDate.parse` to correctly parse the result.
     *
     * @param {String} value the date part to sanitise
     * @param {Number} paddingZeros the amount of zero's that should be leading, defaults to 2
     * @returns the sanitised date part.
     */
    sanitiseDayMonthPart(value, paddingZeros = 2) {
        if (value === '') {
            return value;
        }

        const regexMatch = new RegExp('^0+[1-9]$');

        if (regexMatch.test(value)) {
            return value.substring(value.length - 2);
        }
        return value.padStart(paddingZeros, '0');
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
            value
        } = this.props;
        const yearKey = this.datePart('year');
        const monthKey = this.datePart('month');
        const dayKey = this.datePart('day');
        const parts = this.parseValue(value);

        return <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <fieldset id={name} disabled={disabled} className="govuk-fieldset" role="group">
                <legend className="govuk-fieldset__legend govuk-label--s">{label}</legend>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                <div className="govuk-date-input">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={dayKey}>Day</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={dayKey}
                                name={dayKey}
                                type="number"
                                pattern="[0-9]*"
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
                                type="number"
                                pattern="[0-9]*"
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
                                type="number"
                                pattern="[0-9]*"
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
    data: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxYear: PropTypes.number,
    minYear: PropTypes.number
};

DateInput.defaultProps = {
    disabled: false,
    value: '',
    minYear: 1900
};

export default DateInput;
