import React, { Component } from 'react';
import { components } from 'react-select';
import Select from 'react-select/lib/Async';
import PropTypes from 'prop-types';

class TypeAhead extends Component {

    constructor(props) {
        super(props);
        const choices = Array.from(props.choices);
        choices.unshift({ label: '', options: [{ label: '', value: '' }] });
        this.state = {
            value: this.props.value,
            choices,
            componentMounted: false
        };
    }

    componentDidMount() {
        this.setState({ componentMounted: true });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    handleSelectChange(e) {
        this.setState({ value: e.value });
        this.props.updateState({ [this.props.name]: e.value });
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
            options = [];
        }
        return callback(options);
    }

    renderSelect() {
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
                    components={{
                        Control: (props) => (
                            <components.Control
                                className={error ? ' govuk-typeahead__control--error' : null}
                                {...props}
                            />
                        )
                    }}
                    placeholder='Search'
                    classNamePrefix='govuk-typeahead'
                    options={choices}
                    isDisabled={disabled}
                    error={error}
                    onChange={e => this.handleSelectChange(e)}
                    loadOptions={this.getOptions.bind(this)}
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
                    onChange={e => this.handleChange(e)}
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
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

TypeAhead.defaultProps = {
    disabled: false,
    choices: []
};

export default TypeAhead;