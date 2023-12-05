import React from 'react';
import PropTypes from 'prop-types';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });

const expandableCheckbox = ({ choice, data, error, errors, hint, initiallyOpen, items, label, name, updateState, value, disabled }) => {
    const isChecked = choice.value && value && value.toUpperCase() === choice.value.toUpperCase();
    const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: errors, meta: {}, callback: updateState, baseUrl: '/' });
    const childControlHasValidationError = errors && Array.isArray(items) && items.some(item => errors[item.props.name]);
    const [isOpen, setOpen] = React.useState((initiallyOpen && isChecked) || childControlHasValidationError);

    React.useEffect(() => {
        if (childControlHasValidationError) {
            setOpen(true);
        }
    }, [childControlHasValidationError]);

    const onOpenClick = React.useCallback((e) => {
        e.preventDefault();
        setOpen(!isOpen);
    }, [isOpen]);

    const onCheckBoxChange = React.useCallback((e) => {
        const targetValue = e.target.value;

        setOpen(!isChecked);

        if (isChecked) {
            updateState({ [name]: '' });
        } else {
            updateState({ [name]: targetValue });
        }
    }, [value]);

    return <>
        <div className="govuk-grid-row selectable-details">
            <div className="govuk-grid-column-full">
                {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
                <div className="selectable-details-header govuk-!-margin-bottom-0">
                    <div className={'govuk-checkboxes govuk-checkboxes--small'} style={{ display: 'inline-flex' }}>
                        <div className="govuk-checkboxes__item">
                            <input
                                id={`details-checkbox-${name}`}
                                type="checkbox"
                                name={`details-checkbox-${name}`}
                                className={'govuk-checkboxes__input errorFocus'}
                                value={choice.value}
                                checked={isChecked}
                                onChange={onCheckBoxChange}
                                disabled={disabled}
                            />
                            <label className="govuk-label govuk-checkboxes__label" htmlFor={`details-checkbox-${name}`}>{label}</label>
                        </div>
                    </div>
                    {(items && items.length > 0 && isChecked || childControlHasValidationError) && <div className="selectable-details-link">
                        <a href={`#details-checkbox-${name}`} onClick={onOpenClick}>{`${isOpen ? 'Hide' : 'Show'} Details`} </a>
                    </div>
                    }
                </div>
                {hint && <div className="govuk-hint">{hint}</div>}
                {isOpen && items && items.length > 0 && <div className="selectable-details-content">
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
    disabled: PropTypes.bool,
};

export default expandableCheckbox;
