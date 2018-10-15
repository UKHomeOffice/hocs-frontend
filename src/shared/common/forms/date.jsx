import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DateInput extends Component {

    constructor(props) {
        super(props);
        this.state = this.parseValue(props);
    }

    componentDidMount() {
        this.props.updateState(this.state);
    }

    _onChange(field, value) {
        this.setState({ [field]: value });
        this.props.updateState({ [field]: value });
    }

    datePart(field) { return `${this.props.name}-${field}`; }

    parseValue({ value }) {
        const parts = value && value.split('-');
        return {
            [this.datePart('day')]: parts && parts[2] || '',
            [this.datePart('month')]: parts && parts[1] || '',
            [this.datePart('year')]: parts && parts[0] || ''
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
            maxYear
        } = this.props;
        return <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <fieldset id={name} disabled={disabled} className="govuk-fieldset" role="group">
                <legend className="govuk-fieldset__legend govuk-label--s">{label}</legend>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                <div className="govuk-date-input">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('day')}>Day</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('day')}
                                name={this.datePart('day')}
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                max="31"
                                value={this.state[this.datePart('day')]}
                                onChange={e => this._onChange(this.datePart('day'), e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='govuk-date-input__item'>
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('month')}>Month</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('month')}
                                name={this.datePart('month')}
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                max="12"
                                value={this.state[this.datePart('month')]}
                                onChange={e => this._onChange(this.datePart('month'), e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='govuk-date-input__item'>
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={this.datePart('year')}>Year</label>
                            <input
                                className={`govuk-input govuk-date-input__input govuk-input--width-4  ${error ? 'govuk-input--error' : ''}`}
                                id={this.datePart('year')}
                                name={this.datePart('year')}
                                type="number"
                                pattern="[0-9]*"
                                min={minYear}
                                max={maxYear}
                                value={this.state[this.datePart('year')]}
                                onChange={e => this._onChange(this.datePart('year'), e.target.value)}
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
    minYear: PropTypes.number
};

DateInput.defaultProps = {
    disabled: false,
    value: '',
    minYear: 1900,
    maxYear: (new Date().getFullYear() + 100),
};

export default DateInput;