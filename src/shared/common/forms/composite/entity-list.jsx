import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

class EntityList extends Component {

    constructor(props) {
        super(props);
        const fallbackValue = this.props.choices[0] ? this.props.choices[0].value : null;
        const value = this.props.value || fallbackValue;
        this.state = { ...props, value };
    }

    componentDidMount() {
        this.props.updateState({ [this.props.name]: this.state.value });
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateState({ [this.props.name]: e.target.value });
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
            hasRemoveLink,
            hint,
            label,
            name,
            type
        } = this.props;
        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <span className="govuk-form-hint">{hint}</span>}
                    {error && <span className="govuk-error-message">{error}</span>}

                    <table className='govuk-table'>
                        <tbody className='govuk-table__body'>
                            {choices && choices.map((choice, i) => {
                                return (
                                    <tr className='govuk-radios govuk-table__row' key={i}>
                                        <td className='govuk-table__cell'>
                                            <div className='govuk-radios__item'>
                                                <input id={`${name}-${choice.value}`}
                                                    type={type}
                                                    name={name}
                                                    value={choice.value}
                                                    checked={(this.state.value === choice.value)}
                                                    onChange={e => this.handleChange(e)}
                                                    className={'govuk-radios__input'}
                                                />
                                                <label className="govuk-label govuk-radios__label" htmlFor={`${name}-${choice.value}`}>
                                                    {choice.label}
                                                </label>
                                            </div>
                                        </td>
                                        <td className='govuk-table__cell'>
                                            {hasRemoveLink && <Link to={`/case/${page.caseId}/stage/${page.stageId}/entity/${entity}/${choice.value}/remove`} className="govuk-link">Remove</Link>}
                                        </td>
                                    </tr>
                                );
                            })}
                            {choices.length === 0 && <p className='govuk-body'>No {entity}s</p>}
                        </tbody>
                    </table>
                    {hasAddLink && <Link to={`/case/${page.caseId}/stage/${page.stageId}/entity/${entity}/add`} className="govuk-body govuk-link">Add a {entity}</Link>}
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
    hasAddLink: PropTypes.bool,
    hasRemoveLink: PropTypes.bool,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
    page: PropTypes.object.isRequired
};

EntityList.defaultProps = {
    choices: [],
    disabled: false,
    type: 'radio',
    page: {}
};

const WrappedEntityList = props => (
    <ApplicationConsumer>
        {({ page }) => <EntityList {...props} page={page} />}
    </ApplicationConsumer>
);

export default WrappedEntityList;