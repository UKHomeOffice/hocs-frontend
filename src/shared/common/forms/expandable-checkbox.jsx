import React from 'react';
import PropTypes from 'prop-types';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });

const expandableCheckbox = ({ choice, data, error, errors, hint, initiallyOpen, items, name, updateState, value }) => {
    const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: errors, meta: {}, callback: updateState, baseUrl: '/' });
    const sectionHasValidationError = errors && Array.isArray(items) && items.some(item => errors[item.props.name]);
    const [isOpen, setOpen] = React.useState(initiallyOpen || sectionHasValidationError);

    const onOpenClick = React.useCallback(() => setOpen(!isOpen), [isOpen]);

    const onCheckBoxChange = React.useCallback((e) => {
        const targetValue = e.target.value;

        if (value && value.toUpperCase() === targetValue.toUpperCase()) {
            updateState({ [name]: undefined });
        } else {
            updateState({ [name]: targetValue });
            setOpen(true);
        }
    }, [value]);

    return <>
        <div className="govuk-grid-row selectable-details">
            <div className="govuk-grid-column-full">
                {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}
                <div className="selectable-details-header">
                    <div className={'govuk-checkboxes'} style={{ display: 'inline-flex' }}>
                        <div className="govuk-checkboxes__item">
                            <input
                                id={`details-checkbox-${name}`}
                                type="checkbox"
                                name={`details-checkbox-${name}`}
                                className={'govuk-checkboxes__input'}
                                value={choice.value}
                                checked={
                                    value && value.toUpperCase() === choice.value.toUpperCase()
                                }
                                onChange={onCheckBoxChange}
                            />
                            <label className="govuk-label govuk-checkboxes__label" htmlFor={`details-checkbox-${name}`}>{choice.label}</label>
                        </div>
                    </div>
                    <div className="selectable-details-link">
                        <span onClick={onOpenClick}>Details</span>
                    </div>
                </div>
                {hint && <span className="govuk-hint">{hint}</span>}
                {isOpen && <div className="selectable-details-content">
                    {Array.isArray(items) && items.map(createComponent)}
                </div>}
            </div>
        </div>
    </>;
};

expandableCheckbox.propTypes = {
    choice: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    error: PropTypes.string,
    errors: PropTypes.object,
    hint: PropTypes.string,
    initiallyOpen: PropTypes.bool,
    items: PropTypes.array,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default expandableCheckbox;
