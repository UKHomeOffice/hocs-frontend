import React from 'react';
import TextInput from './text.jsx';
import MappedText from './mapped-text.jsx';
import MappedDisplay from './mapped-display.jsx';
import ChangeLink from './composite/change-link.jsx';
import SomuList from './composite/somu-list.jsx';
import Radio from './radio-group.jsx';
import DateInput from './date.jsx';
import Checkbox from './checkbox-group.jsx';
import TextArea from './text-area.jsx';
import AddDocument from './composite/document-add.jsx';
import EntityList from './composite/entity-list.jsx';
import EntityManager from './composite/entity-manager.jsx';
import Button from './button.jsx';
import Link from './link.jsx';
import BackLink from './backlink.jsx';
import BackButton from './back-button.jsx';
import Paragraph from './paragraph.jsx';
import Inset from './inset.jsx';
import Dropdown from './dropdown.jsx';
import TypeAhead from './type-ahead.jsx';
import Panel from './panel.jsx';
import Accordion from './accordion.jsx';
import Hidden from './hidden.jsx';
import ExpandableCheckbox from './expandable-checkbox.jsx';
import FlowDirectionLink from './flow-direction-link.jsx';
import HideConditionFunctions from './../../helpers/hide-condition-functions';
import ConfirmationWithCaseRef from './confirmation-with-case-ref.jsx';
import ReviewField from './review-field.jsx';

function defaultDataAdapter(name, data, currentValue) {
    return data[name] || currentValue;
}

const retrieveValue = ({ defaultValue, populateFromCaseData = true, name }, dataAdapter, data) => {
    let value = defaultValue || '';

    if (populateFromCaseData && data) {
        value = dataAdapter ? dataAdapter(name, data) : defaultDataAdapter(name, data, value);
    }

    return value;
};

function reviewBoxDataAdapter(name, data) {
    return data[name];
}

function hasFieldData(obj) {
    if (typeof obj.name !== 'object' && obj.child && obj.child.props) {
        return obj.child.props;
    }
    return obj;
}

function renderFormComponent(Component, options) {
    const { key, config, data, errors, callback, dataAdapter, page, caseRef, switchDirection } = options;

    if (isComponentVisible(config, data)) {
        return <Component key={key}
            {...config}
            data={data}
            error={errors && errors[config.name]}
            errors={errors}
            caseRef={caseRef}
            value={retrieveValue(hasFieldData(config), dataAdapter, data)}
            updateState={callback ? data => callback(data) : null}
            page={page}
            switchDirection={switchDirection}/>;
    }
    return null;
}

function isComponentVisible(config, data) {
    let isVisible = true;
    let { visibilityConditions, hideConditions } = config;

    // show component based on visibilityConditions
    if (visibilityConditions) {
        isVisible = false;
        for (let i = 0; i < visibilityConditions.length; i++) {
            const condition = visibilityConditions[i];
            if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = true;
            }
        }
    }

    // hide component based on hideConditions
    if (hideConditions) {
        for (let i = 0; i < hideConditions.length; i++) {
            const condition = hideConditions[i];

            if (condition.function && Object.prototype.hasOwnProperty.call(HideConditionFunctions, condition.function)) {
                isVisible = HideConditionFunctions[condition.function](data);
            } else if (data[condition.conditionPropertyName] && data[condition.conditionPropertyName] === condition.conditionPropertyValue) {
                isVisible = false;
            }
        }
    }
    return isVisible;
}

export function formComponentFactory(field, options) {
    const { key, config, data, errors, callback, page, caseRef, switchDirection } = options;

    switch (field) {
        case 'radio':
            return renderFormComponent(Radio, { key, config, data, errors, callback });
        case 'text':
            return renderFormComponent(TextInput, { key, config, data, errors, callback });
        case 'mapped-text':
            return renderFormComponent(MappedText, { key, config, data, errors, callback });
        case 'hidden':
            return renderFormComponent(Hidden, { key, config, data, errors, callback });
        case 'date':
            return renderFormComponent(DateInput, { key, config, data, errors, callback });
        case 'checkbox':
            return renderFormComponent(Checkbox, { key, config, data, errors, callback });
        case 'text-area':
            return renderFormComponent(TextArea, { key, config, data, errors, callback });
        case 'dropdown':
            return renderFormComponent(Dropdown, { key, config, data, errors, callback });
        case 'type-ahead':
            return renderFormComponent(TypeAhead, { key, config, data, errors, callback });
        case 'button':
            return renderFormComponent(Button, { key, config });
        case 'link':
            return renderFormComponent(Link, { key, config });
        case 'add-document':
            return renderFormComponent(AddDocument, { key, config, errors, callback });
        case 'entity-list':
            return renderFormComponent(EntityList, {
                key,
                config: { ...config, baseUrl: options.baseUrl },
                data,
                errors,
                callback
            });
        case 'somu-list':
            return renderFormComponent(SomuList, {
                key,
                config: { ...config, baseUrl: options.baseUrl },
                data,
                errors,
                callback
            });
        case 'heading':
            return (
                <h2 key={key} className='govuk-heading-m'>
                    {config.label}
                </h2>
            );
        case 'panel':
            return renderFormComponent(Panel, { key, config });
        case 'inset':
            return renderFormComponent(Inset, { key, data, config });
        case 'confirmation-with-case-ref':
            return renderFormComponent(ConfirmationWithCaseRef, { key, data, config, caseRef });
        case 'paragraph':
            return renderFormComponent(Paragraph, { key, config });
        case 'entity-manager':
            return renderFormComponent(EntityManager, { key, config: { ...config, baseUrl: options.baseUrl } });
        case 'display':
            return (
                <span className='govuk-body full-width'><strong>{config.label}: </strong>{data[config.name]}</span>
            );
        case 'mapped-display':
            return renderFormComponent(MappedDisplay, { key, config, data, errors, callback });
        case 'accordion':
            return renderFormComponent(Accordion, { data, key, config, errors, callback, page });
        case 'expandable-checkbox':
            return renderFormComponent(ExpandableCheckbox, { data, key, config, errors, callback });
        case 'flow-direction-link':
            return renderFormComponent(FlowDirectionLink, {
                key, config: {
                    ...config, caseId: page.caseId, stageId: page.stageId,
                    action: `/case/${page.caseId}/stage/${page.stageId}/direction/${config.flowDirection}`
                }
            });
        case 'change-link':
            return renderFormComponent(ChangeLink, { data, key, config, errors, callback });
        case 'review-field':
            return renderFormComponent(ReviewField, { data, key, config, errors, dataAdapter: reviewBoxDataAdapter, callback, switchDirection });
        default:
            return null;
    }
}

export function secondaryActionFactory(field, options) {
    const { key, data, config, page, switchDirection } = options;
    switch (field) {
        case 'backlink':
            return renderFormComponent(BackLink, { data, key, config });
        case 'button':
            return renderFormComponent(Button, { data, key, config });
        case 'backButton':
            return renderFormComponent(BackButton, {
                data,
                key,
                config: {
                    ...config, caseId: page.caseId, stageId: page.stageId,
                    action: `/case/${page.caseId}/stage/${page.stageId}/direction/BACKWARD`
                },
                switchDirection
            });
        default:
            return null;
    }
}
