import React from 'react';
import TextInput from './text.jsx';
import MappedText from './mapped-text.jsx';
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

function defaultDataAdapter(name, data) {
    return data[name] || '';
}

function renderFormComponent(Component, options) {
    const { key, config, data, errors, callback, dataAdapter } = options;
    let value = '';
    if (data) {
        value = dataAdapter ? dataAdapter(config.name, data) : defaultDataAdapter(config.name, data);
    }
    return <Component key={key}
        {...config}
        data={data}
        error={errors && errors[config.name]}
        errors={errors}
        value={value}
        updateState={callback ? data => callback(data) : null} />;
}

export function formComponentFactory(field, options) {
    const { key, config, data, errors, callback } = options;
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
        case 'paragraph':
            return renderFormComponent(Paragraph, { key, config });
        case 'entity-manager':
            return renderFormComponent(EntityManager, { key, config: { ...config, baseUrl: options.baseUrl } });
        case 'display':
            return (
                <span className='govuk-body full-width'><strong>{config.label}: </strong>{data[config.name]}</span>
            );
        case 'accordion':
            return renderFormComponent(Accordion, { data, key, config, errors, callback });
        case 'expandable-checkbox':
            return renderFormComponent(ExpandableCheckbox, { data, key, config, errors, callback });
        default:
            return null;
    }
}

export function secondaryActionFactory(field, options) {
    const { key, config, page } = options;
    switch (field) {
        case 'backlink':
            return renderFormComponent(BackLink, { key, config });
        case 'button':
            return renderFormComponent(Button, { key, config });
        case 'backButton':
            return renderFormComponent(BackButton, {
                key, config: {
                    ...config, caseId: page.caseId, stageId: page.stageId,
                    action: `/case/${page.caseId}/stage/${page.stageId}/back`
                }
            });
        default:
            return null;
    }
}