import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

class EntityList extends Component {

    constructor(props) {
        super(props);
        const primaryChoice = this.props.choices ? this.props.choices.find(choice => choice.isPrimary === true) : null;
        const fallbackValue = primaryChoice ? primaryChoice.value : this.props.choices[0] ? this.props.choices[0].value : null;
        const value = this.loadValue(this.props.value, this.props.choices) || fallbackValue;
        this.state = { ...props, value };
        this.initialCheckedValue = this.props.checkedValue;
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
    }

    loadValue(value, choices) {
        for (let i = 0; i < choices.length; ++i) {
            if (choices[i].value === value) {
                return value;
            }
        }
        return '';
    }

    render() {
        const {
            page,
            choices,
            className,
            disabled,
            entity,
            error,
            hasAddLink,
            addUrlPath,
            hasEditLink,
            hasRemoveLink,
            hideRemovePrimary,
            hint,
            label,
            name,
            type
        } = this.props;

        const { hideSidebar } = this.props || false;

        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <span className="govuk-form-hint">{hint}</span>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                    <dl className="govuk-summary-list">
                        {choices && choices.map((choice, i) => {
                            const checkedValue = this.props.checkedValue || this.state.value;
                            return (
                                <div className="govuk-summary-list__row govuk-radios govuk-radios--small" key={i}>
                                    <dt className="govuk-summary-list__key padding-top--small">
                                        <div className='govuk-radios__item'>
                                            <input id={`${name}-${choice.value}`}
                                                type={type}
                                                name={name}
                                                value={choice.value}
                                                defaultChecked={(choice.value === checkedValue)}
                                                onChange={e => this.handleChange(e)}
                                                className={'govuk-radios__input'}
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${choice.value}`}>
                                                {choice.label}
                                            </label>
                                        </div>
                                    </dt>
                                    <dd className="govuk-summary-list__actions">
                                        <ul className="govuk-summary-list__actions-list">
                                            {hasEditLink && <li className="govuk-summary-list__actions-list-item">
                                                <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/${entity}/${choice.value}/update?hideSidebar=${hideSidebar}`} className="govuk-link">Edit</Link>
                                            </li>}
                                            <li className="govuk-summary-list__actions-list-item">
                                                {hasRemoveLink && (!hideRemovePrimary || choice.value !== this.initialCheckedValue) && <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/${entity}/${choice.value}/remove?hideSidebar=${hideSidebar}`} className="govuk-link">Remove</Link>}
                                            </li>
                                        </ul>
                                    </dd>
                                </div>
                            );
                        })}
                        <br />
                        {hasAddLink && <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/${entity}/${addUrlPath}?hideSidebar=${hideSidebar}`} className="govuk-body govuk-link">Add a {entity}</Link>}
                    </dl>
                </fieldset>

            </div>
        );
    }
}

EntityList.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    entity: PropTypes.string.isRequired,
    addUrlPath: PropTypes.string,
    hasAddLink: PropTypes.bool,
    hasEditLink: PropTypes.bool,
    hasRemoveLink: PropTypes.bool,
    hideRemovePrimary: PropTypes.bool,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    checkedValue: PropTypes.string,
    page: PropTypes.object.isRequired,
    data: PropTypes.object,
    hideSidebar: PropTypes.bool.isRequired
};

EntityList.defaultProps = {
    choices: [],
    disabled: false,
    hideRemovePrimary: false,
    addUrlPath: 'add',
    type: 'radio',
    page: {},
    hideSidebar: false
};

const WrappedEntityList = props => (
    <ApplicationConsumer>
        {({ page }) => <EntityList {...props} page={page} />}
    </ApplicationConsumer>
);

export default WrappedEntityList;
