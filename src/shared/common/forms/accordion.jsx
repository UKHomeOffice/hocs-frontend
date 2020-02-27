import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });
const itemHasValidationError = errors => item => errors[item.props.name] || childControlHasValidationError(errors, item);
const childControlHasValidationError = (errors, { props: { items } = {} } = {}) => Array.isArray(items) && items.some(itemHasValidationError(errors));

function Section({ data, errors, index, items, title, updateState }) {
    const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: errors, meta: {}, callback: updateState, baseUrl: '/' });
    const sectionHasValidationError = errors && Array.isArray(items) && items.some(itemHasValidationError(errors));
    const [isVisible, setVisible] = useState(sectionHasValidationError);
    const [isFocussed, setFocussed] = useState(false);

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
    }, [isVisible]);

    return (
        <div key={index} className={classNames('govuk-accordion__section', { 'govuk-accordion__section--expanded': isVisible })}>
            <div className={classNames('govuk-accordion__section-header', { 'govuk-accordion__section-header--focused': isFocussed })} onClick={clickHandler} onFocus={onFocus} onBlur={onBlur}>
                <h2 className='govuk-accordion__section-heading'>
                    <button type='button' className='govuk-accordion__section-button' id={`accordion-default-heading-${index}`}>
                        {title}
                    </button>
                </h2>
                <span className='govuk-accordion__icon' aria-hidden='true'></span>
            </div>
            <div id={`accordion-default-content-${index}`} className='govuk-accordion__section-content' aria-labelledby={`accordion-default-heading-${index}`}>
                {Array.isArray(items) && items.map(createComponent)}
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
    updateState: PropTypes.func.isRequired
};

function Accordion({ name, sections, data, updateState, errors }) {
    return (
        <div id={name} className='govuk-accordion' data-module='accordion'>
            {Array.isArray(sections) && sections.map(({ items, title }, index) => <Section data={data} errors={errors} items={items} index={index} key={index} title={title} updateState={updateState} />)}
        </div>
    );
}

Accordion.propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object,
    name: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    updateState: PropTypes.func
};

export default Accordion;
