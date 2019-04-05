import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });

const createSection = (data) => {
    function Section({ title, items }, i) {
        const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: {}, meta: {}, callback: () => { }, baseUrl: '/' });
        const [isVisible, setVisible] = useState(true);

        useEffect(() => setVisible(false), [items]);

        const clickHandler = event => {
            event.preventDefault();
            setVisible(!isVisible);
        };

        return (
            <div key={i} className={isVisible ? 'govuk-accordion__section govuk-accordion__section--expanded' : 'govuk-accordion__section'}>
                <div className='govuk-accordion__section-header' onClick={clickHandler}>
                    <h2 className='govuk-accordion__section-heading'>
                        <button type='button' className='govuk-accordion__section-button' id={`accordion-default-heading-${i}`}>
                            {title}
                        </button>
                    </h2>
                    <span className='govuk-accordion__icon' aria-hidden='true'></span>
                </div>
                <div id={`accordion-default-content-${i}`} className='govuk-accordion__section-content' aria-labelledby={`accordion-default-heading-${i}`}>
                    {Array.isArray(items) && items.map(createComponent)}
                </div>
            </div>
        );
    }
    Section.propTypes = {
        title: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired
    };
    return Section;
};

const getAccordionComponent = (data) => {
    function Accordion({ name, sections }) {
        return (
            <div id={name} className='govuk-accordion' data-module='accordion'>
                {Array.isArray(sections) && sections.map(createSection(data))}
            </div>
        );
    }
    Accordion.propTypes = {
        name: PropTypes.string.isRequired,
        sections: PropTypes.array.isRequired
    };
    return Accordion;
};



export default getAccordionComponent;