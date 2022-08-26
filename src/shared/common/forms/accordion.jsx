import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });
const itemHasValidationError = errors => item => errors[item.props.name] || childControlHasValidationError(errors, item);
const childControlHasValidationError = (errors, { props: { items } = {} } = {}) => Array.isArray(items) && items.some(itemHasValidationError(errors));

function Section({ data, errors, index, items, title, updateState, page }) {
    const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: errors, meta: {}, callback: updateState, baseUrl: '/', page });
    const sectionHasValidationError = errors && Array.isArray(items) && items.some(itemHasValidationError(errors));
    const [isVisible, setVisible] = useState(sectionHasValidationError);
    const [isFocussed, setFocussed] = useState(false);
    const [toggleText, setToggleText] = useState('Show');

    useEffect(() => {
        if (sectionHasValidationError) {
            setVisible(true);
        }
    }, [errors]);

    const onBlur = React.useCallback(() => setFocussed(false), []);
    const onFocus = React.useCallback(() => setFocussed(true), []);

    const clickHandler = React.useCallback(event => {
        event.preventDefault();
        setVisible(!isVisible);
        if (toggleText === 'Show') {
            setToggleText('Hide');
        } else {
            setToggleText('Show');
        }
    }, [isVisible, toggleText]);

    return (
        <div data-module="govuk-accordion" id="accordion-default">
            <div key={index} className={classNames('govuk-accordion__section', { 'govuk-accordion__section--expanded': isVisible })}>
                <div className={classNames('govuk-accordion__section-header', { 'govuk-accordion__section-header--focused': isFocussed })} onClick={clickHandler} onFocus={onFocus} onBlur={onBlur}>
                    <h2 className='govuk-accordion__section-heading'>
                        <button type='button'
                            aria-controls={`accordion-default-content-${index}`}
                            className='govuk-accordion__section-button'
                            aria-expanded={isVisible}
                        >
                            <span className='govuk-accordion__section-heading-text' id={`accordion-default-heading-${index}`}>
                                <span className='govuk-accordion__section-heading-text-focus'>
                                    {title}
                                </span>
                            </span>
                            <span className='govuk-accordion__section-toggle' data-nosnippet=''>
                                <span className='govuk-accordion__section-toggle-focus'>
                                    <span className={classNames('govuk-accordion-nav__chevron', { 'govuk-accordion-nav__chevron--down' : !isVisible })}></span>
                                    <span className='govuk-accordion__section-toggle-text'>{toggleText}
                                        <span className='govuk-visually-hidden'> this section</span>
                                    </span>
                                </span>
                            </span>
                        </button>
                    </h2>
                </div>
                <div id={`accordion-default-content-${index}`} className='govuk-accordion__section-content' aria-labelledby={`accordion-default-heading-${index}`}>
                    {Array.isArray(items) && items.map(createComponent)}
                </div>
            </div>
        </div>
    );
}
Section.propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object,
    items: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
};

const Accordion = function Accordion({ name, sections, data, updateState, errors, page }) {
    const [showError, setShowError] = useState(false);
    const [errorId, setErrorId] = useState('');

    if (!name && sections[0].name) {
        name = sections[0].name;
    }

    useEffect(() => {
        if (errors && errors[name]) {
            setErrorId(name + '-error');
            setShowError(true);
        } else {
            setErrorId('');
            setShowError(false);
        }
    }, [errors]);

    return (
        <div id={name} className={`govuk-accordion${showError ? ' govuk-form-group--error' : ''}`} data-module='accordion'>
            { showError && errors && <span id={errorId} className="govuk-error-message">{ errors[name] }</span> }
            {Array.isArray(sections) && sections.map(({ items, title }, index) => <Section data={data} errors={errors} items={items} index={index} key={index} title={title} updateState={updateState} page={page} />)}
        </div>
    );
};

Accordion.propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object,
    name: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    updateState: PropTypes.func,
    page: PropTypes.object.isRequired
};

export default Accordion;
