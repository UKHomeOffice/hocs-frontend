import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {

    constructor(props) {
        super(props);
        const choices = Array.from(props.choices);
        const conditionChoices = Array.from(JSON.parse(JSON.stringify(props.conditionChoices)));

        const choicesToUse = Radio.getChoicesToUse(choices, conditionChoices, this.props);
        this.state = { value: this.props.value, choices, conditionChoices, choicesToUse, selectedChoice: "blank" };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.props.value });
        // eslint-disable-next-line no-undef
        if (window.GOVUKFrontend) {
            // eslint-disable-next-line no-undef
            window.GOVUKFrontend.initAll();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.state.value) {
            this.props.updateState({ [this.props.name]: this.state.value });
        }
    }

    handleChange(e, choice) {
        const index = `${choice.value}Text`;
        this.props.updateState({ [this.props.name]: e.target.value });
        if ('conditionalContent' in choice) {
            this.props.updateState({ [index]: this.props.data[index] || '' });
        }
        if ('conditionalContentAfter' in choice){
            console.log("before", this.state.selectedChoice);
            this.state.selectedChoice = choice;
            this.props.updateState({ [index]: this.props.data[index] || '' });
        }
    }

    handleChangeForTextArea(e) {
        this.props.updateState({ [e.target.id]: e.target.value });
    }

    isConditionalContentError(errors, contentLabelKey) {
        return errors && contentLabelKey in errors;
    }

    returnConditionalContentValue(choiceValueText) {
        if (choiceValueText in this.props.data) {
            return this.props.data[choiceValueText];
        }
        return '';
    }

    static getDerivedStateFromProps(props, state) {
        const { choicesToUse } = state;
        const { choices, conditionChoices } = props;
        const newChoicesToUse = Radio.getChoicesToUse(choices, conditionChoices, props);
        if (!Radio.choicesEqual(choicesToUse, newChoicesToUse)) {
            for (var i = 0; i < newChoicesToUse.length; i++) {
                if (newChoicesToUse[i].value === props.value) {
                    return {
                        choicesToUse: newChoicesToUse,
                        value: props.value
                    };
                }
            }
            return {
                choicesToUse: newChoicesToUse,
                value: ''
            };
        }
        if (props.value !== state.value) {
            return {
                value: props.value
            };
        }
        return null;
    }

    static choicesEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i].label !== b[i].label || a[i].value !== b[i].value) {
                return false;
            }
        }
        return true;
    }

    static getChoicesToUse(defaultChoices, conditionChoices, props) {
        var choicesToUse = defaultChoices;
        if (conditionChoices) {
            for (var i = 0; i < conditionChoices.length; i++) {
                const conditionPropertyValue = props.data[conditionChoices[i].conditionPropertyName];
                if (conditionChoices[i].conditionPropertyValue === conditionPropertyValue) {
                    choicesToUse = conditionChoices[i].choices;
                    break;
                }
            }
        }
        return choicesToUse;
    }

    render() {
        const {
            className,
            disabled,
            error,
            errors,
            hint,
            label,
            name,
            type,
            value
        } = this.props;
        console.log("type:", type);
        console.log("name: ", name);
        console.log("value: ", value);
        console.log("label: ", label);
        const { choicesToUse, selectedChoice } = this.state;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <span className="govuk-hint">{hint}</span>}
                    {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                    <div id={`${name}-radios`} className={'govuk-radios govuk-radios--conditional'} data-module="govuk-radios">
                        {choicesToUse && choicesToUse.map((choice, i) => {
                            return (
                                <Fragment key={i}>
                                    <div className="govuk-radios__item">
                                        <input id={`${name}-${choice.value}`}
                                            type={type}
                                            name={name}
                                            value={choice.value}
                                            checked={(value === choice.value)}
                                            onChange={e => this.handleChange(e, choice)}
                                            data-aria-controls={`conditional-${name}-${choice.value}`}
                                            className={'govuk-radios__input'}
                                        />
                                        <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${choice.value}`}>
                                            {choice.label}
                                            {choice.description && <span className="govuk-body-s full-width">{choice.description}</span>}
                                        </label>
                                    </div>

                                    {choice.conditionalContent &&
                                        <div className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                            id={`conditional-${name}-${choice.value}`}>
                                            <div className={`govuk-form-group ${this.isConditionalContentError(errors, `${choice.value}Text`) ? ' govuk-form-group--error' : ''}`}>
                                                <label className="govuk-label" htmlFor={`${choice.value}Text`}>
                                                    {choice.conditionalContent.label}
                                                    {choice.conditionalContent.description && <span className="govuk-body-s full-width">{choice.conditionalContent.description}</span>}
                                                </label>
                                                {this.isConditionalContentError(errors, `${choice.value}Text`) &&
                                                    <span id={`${choice.value}Text-error`} className="govuk-error-message">
                                                        <span className="govuk-visually-hidden">Error:</span>{errors[`${choice.value}Text`]}
                                                    </span>
                                                }
                                                <textarea
                                                    className={`govuk-textarea ${this.isConditionalContentError(errors, `${choice.value}Text`) ? ' govuk-textarea--error' : ''}`}
                                                    id={`${choice.value}Text`}
                                                    name={`${choice.value}Text`}
                                                    disabled={disabled}
                                                    rows="4"
                                                    onChange={e => this.handleChangeForTextArea(e)}
                                                    value={this.returnConditionalContentValue(`${value}Text`)}
                                                />
                                            </div>

                                        </div>
                                    }

                                </Fragment>
                            );
                        })}
                        {choicesToUse.length === 0 && <p className="govuk-body">No options available</p>}
                    </div>
                    {this.state.selectedChoice.conditionalContentAfter && this.state.selectedChoice.conditionalContentAfter.map((content, i) => {
                        return (
                            <Fragment key={i}>
                            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                                <fieldset id={content.name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>
                                    {console.log("this.state.selectedChoice.conditionalContentAfter.label", content.label)}

                                    <legend id={`${content.name}-legend`} className="govuk-fieldset__legend">
                                        <span className="govuk-fieldset__heading govuk-label--s">{content.label}</span>
                                    </legend>

                                    {hint && <span className="govuk-hint">{hint}</span>}
                                    {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                                    {content.type === 'radio' && content.afterContent.map((choice, i)=>{
                                        return(
                                        <Fragment key={i}>
                                            <div className="govuk-radios__item">
                                                <input id={`${choice.label}-${choice.value}`}
                                                    type="radio"
                                                    name={choice.name}
                                                    value={choice.value}
                                                    checked={(value === choice.value)}
                                                    onChange={e => this.handleChange(e, choice)}
                                                    data-aria-controls={`conditional-${choice.name}-${choice.value}`}
                                                    className={'govuk-radios__input'}
                                                />
                                                <label className="govuk-label govuk-radios__label" htmlFor={`${choice.label}-${choice.value}`}>
                                                    {choice.label}
                                                    {/* {content.description && <span className="govuk-body-s full-width">{content.description}</span>} */}
                                                </label>
                                            </div>

                                            {choice.conditionalContent &&
                                                <div className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                                    id={`conditional-${name}-${choice.value}`}>
                                                    <div className={`govuk-form-group ${this.isConditionalContentError(errors, `${choice.value}Text`) ? ' govuk-form-group--error' : ''}`}>
                                                        <label className="govuk-label" htmlFor={`${choice.value}Text`}>
                                                            {choice.conditionalContent.label}
                                                            {choice.conditionalContent.description && <span className="govuk-body-s full-width">{choice.conditionalContent.description}</span>}
                                                        </label>
                                                        {this.isConditionalContentError(errors, `${choice.value}Text`) &&
                                                            <span id={`${choice.value}Text-error`} className="govuk-error-message">
                                                                <span className="govuk-visually-hidden">Error:</span>{errors[`${choice.value}Text`]}
                                                            </span>
                                                        }
                                                        <textarea
                                                            className={`govuk-textarea ${this.isConditionalContentError(errors, `${choice.value}Text`) ? ' govuk-textarea--error' : ''}`}
                                                            id={`${choice.value}Text`}
                                                            name={`${choice.value}Text`}
                                                            disabled={disabled}
                                                            rows="4"
                                                            onChange={e => this.handleChangeForTextArea(e)}
                                                            value={this.returnConditionalContentValue(`${choice.value}Text`)}
                                                        />
                                                    </div>

                                                </div>
                                            }
                                        </Fragment>
                                        )
                                    })}
                                    {content.type === 'dropdown' &&
                                            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                                            <label htmlFor={content.name} id={`${content.name}-label`} className="govuk-label govuk-label--s">{content.label}</label>
                                            {hint && <span className="govuk-hint">{hint}</span>}
                                            {error && <span id={`${content.name}-error`} className="govuk-error-message">{error}</span>}

                                            <select className={`govuk-select ${error ? 'govuk-select--error' : ''}`}
                                                id={content.name}
                                                name={content.name}
                                                disabled={disabled}
                                                onChange={e => this.handleChange(e)}
                                                value={this.state.value}
                                            >
                                                {choicesToUse && choicesToUse.map((choice, i) => {
                                                    return (
                                                        <option key={i} value={choice.value} >{choice.label}</option>
                                                    );
                                                })}
                                            </select>
                                            </div>
                                    }
                                    {content.type === 'textarea' &&
                                            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                                            <label htmlFor={content.name} id={`${content.name}-label`} className="govuk-label govuk-label--s">{content.label}</label>


                                            {hint && <span className="govuk-hint">{hint}</span>}
                                            {error && <span id={`${content.name}-error`} className="govuk-error-message">{error}</span>}


                                            <textarea className={`govuk-textarea form-control-3-4 ${error ? 'govuk-textarea--error' : ''}`}
                                                id={content.name}
                                                name={content.name}
                                                disabled={disabled}
                                                rows={content.rows}
                                                onChange={e => this._onChange(e)}
                                                defaultValue={content.defaultValue}
                                            />
                                            </div>
                                    }
                                    </fieldset>
                                </div>
                            </Fragment>
                        )
                    })}
                </fieldset>
            </div>
        );
    }
}

Radio.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    conditionChoices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    errors: PropTypes.object,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

Radio.defaultProps = {
    choices: [],
    conditionChoices: [],
    data: {},
    disabled: false,
    type: 'radio'
};

export default Radio;
