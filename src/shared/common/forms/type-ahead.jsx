import React, { Component } from 'react';
import Select from 'react-select/async';
import PropTypes from 'prop-types';

class TypeAhead extends Component {

    constructor(props) {
        super(props);
        let choices = Array.from(props.choices);

        // formatting input if it comes as key-value pairs (group is defined as blank string)
        if (choices.length > 0 && choices[0].options === undefined) {
            choices = choices
                .map(d => ({
                    label: '', options: [{
                        label: d.label,
                        value: d.value
                    }]
                }));
        }

        choices.unshift({ label: '', options: [{ label: '', value: '' }] });
        this.state = {
            value: this.props.value,
            choices,
            componentMounted: false
        };
    }

    componentDidMount() {
        this.setState({ componentMounted: true });
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    handleChange(e) {
        const value = e ? e.value : null;
        this.setState({ value });
        this.props.updateState({ [this.props.name]: value });
    }

    getOptions(input, callback) {
        let options;
        if (input.length > 0) {
            const searchString = input.toLowerCase().trim();
            options = this.state.choices.reduce((reducer, group) => {
                reducer.push({
                    label: group.label,
                    options: group.options
                        .filter(item => item.label.toLowerCase().indexOf(searchString) !== -1)
                        .slice(0, 100)
                });
                return reducer;
            }, []);
        } else {
            options = this.props.defaultOptions ? this.state.choices : [];
        }
        return callback(options);
    }

    renderSelect() {
        const {
            clearable,
            disabled,
            error,
            hint,
            label,
            name,
            defaultOptions
        } = this.props;
        const { choices } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                <Select
                    styles={{
                        control: () => ({}),
                        indicators: () => ({}),
                        indicatorSeparator: () => ({}),
                        indicator: () => ({}),
                        dropdownIndicator: () => ({}),
                        menu: () => ({}),
                        menuList: () => ({}),
                        groupHeading: () => ({}),
                        option: () => ({}),
                        valueContainer: () => ({}),
                        placeholder: () => ({})
                    }}
                    id={name}
                    placeholder='Search'
                    classNamePrefix='govuk-typeahead'
                    options={choices}
                    isDisabled={disabled}
                    isClearable={clearable}
                    error={error}
                    onChange={this.handleChange.bind(this)}
                    loadOptions={this.getOptions.bind(this)}
                    defaultOptions={defaultOptions}
                    className={error ? ' govuk-typeahead__control--error' : null}
                />
            </div >
        );
    }

    renderOptions() {
        const {
            disabled,
            error,
            hint,
            label,
            name
        } = this.props;
        const { choices } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                {hint && <span className="govuk-hint">{hint}</span>}
                {error && <span className="govuk-error-message">{error}</span>}

                <select className={`govuk-select ${error ? 'govuk-select--error' : ''}`}
                    id={name}
                    name={name}
                    disabled={disabled}
                    value={this.state.value}
                >
                    {choices && choices.map((group, i) => {
                        return (
                            <optgroup key={i} label={group.label} >
                                {group.options && group.options.map((choice, j) => {
                                    return (
                                        <option key={j} value={choice.value} >{choice.label}</option>
                                    );
                                })}
                            </optgroup>
                        );
                    })}
                </select>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.componentMounted ? this.renderSelect() : this.renderOptions()}
            </div>
        );
    }

}

TypeAhead.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    defaultOptions: PropTypes.bool,
};

TypeAhead.defaultProps = {
    clearable: true,
    disabled: false,
    choices: [],
    defaultOptions: false
};

export default TypeAhead;
