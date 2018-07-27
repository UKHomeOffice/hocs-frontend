import React from 'react';
import TextInput from './text.jsx';
import Radio from './radio-group.jsx';
import DateInput from './date.jsx';
import Checkbox from './checkbox-group.jsx';
import TextArea from './text-area.jsx';
import AddDocument from './composite/document-add.jsx';
import EntityList from './composite/entity-list.jsx';
import Button from './button.jsx';
import BackLink from './backlink.jsx';
import Paragraph from './paragraph.jsx';
import Inset from './inset.jsx';
import Dropdown from './dropdown.jsx';
import Panel from './panel.jsx';

function defaultDataAdapter(name, data) {
    return data[name];
}

function checkboxDataAdapter(name, data) {
    return Object.entries(data)
        .filter(e => e.key.startsWith(name) && e.value === true)
        .reduce((acc, e) => acc.push(e.value), []);
}

function renderFormComponent(Component, options) {
    const { key, config, data, errors, callback, dataAdapter } = options;
    let value = null;
    if (data) {
        value = dataAdapter ? dataAdapter(data) : defaultDataAdapter(config.name, data);
    }
    return <Component key={key}
        {...config}
        error={errors && errors[config.name]}
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
    case 'date':
        return renderFormComponent(DateInput, { key, config, data, errors, callback });
    case 'checkbox':
        return renderFormComponent(Checkbox, { key, config, data, errors, callback, dataAdapter: checkboxDataAdapter });
    case 'text-area':
        return renderFormComponent(TextArea, { key, config, data, errors, callback });
    case 'dropdown':
        return renderFormComponent(Dropdown, { key, config, data, errors, callback });
    case 'button':
        return renderFormComponent(Button, { key, config });
    case 'add-document':
        return renderFormComponent(AddDocument, { key, config, errors, callback });
    case 'entity-list':
        return renderFormComponent(EntityList, {
            key,
            config: { ...config, actionUrl: '/' },
            data,
            errors,
            callback
        });
    case 'heading':
        return (
            <h2 key={key} className="heading-medium">
                {config.label}
            </h2>
        );
    case 'panel':
        return renderFormComponent(Panel, { key, config });
    case 'inset':
        return renderFormComponent(Inset, { key, config });
    case 'paragraph':
        return renderFormComponent(Paragraph, { key, config });
    default:
        return null;
    }
}

export function secondaryActionFactory(field, options) {
    const { key, config } = options;
    switch (field) {
    case 'backlink':
        return renderFormComponent(BackLink, { key, config });
    case 'button':
        return renderFormComponent(Button, { key, config });
    default:
        return null;
    }
}