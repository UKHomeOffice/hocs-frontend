import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { formComponentFactory } from './form-repository.jsx';

const getComponentFactoryInstance = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });

const createSection = (data, updateState) => {
    function Section({ title, items }, key) {
        const createComponent = getComponentFactoryInstance(formComponentFactory, { data, errors: {}, meta: {}, callback: updateState, baseUrl: '/' });
        const [isVisible, setVisible] = useState(true);

        useEffect(() => {
            setVisible(false);
        }, []);

        const clickHandler = event => {
            event.preventDefault();
            setVisible(!isVisible);
        };

        return (
            <div key={key} className={isVisible ? 'govuk-accordion__section govuk-accordion__section--expanded' : 'govuk-accordion__section'}>
                <div className='govuk-accordion__section-header' onClick={clickHandler}>
                    <h2 className='govuk-accordion__section-heading'>
                        <button type='button' className='govuk-accordion__section-button' id={`accordion-default-heading-${key}`}>
                            {title}
                        </button>
                    </h2>
                    <span className='govuk-accordion__icon' aria-hidden='true'></span>
                </div>
                <div id={`accordion-default-content-${key}`} className='govuk-accordion__section-content' aria-labelledby={`accordion-default-heading-${key}`}>
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

function Accordion({ name, sections, data, updateState }) {
    return (
        <div id={name} className='govuk-accordion' data-module='accordion'>
            {Array.isArray(sections) && sections.map(createSection(data, updateState))}
        </div>
    );
}

Accordion.propTypes = {
    data: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    updateState: PropTypes.func
};

export default memoizeOne(data => {
    const WithData = props => <Accordion data={data} {...props} />;
    return WithData;
}, () => true);
