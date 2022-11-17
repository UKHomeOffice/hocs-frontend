const Form = require('../../services/forms/form-builder');
const { Component } = require('../../services/forms/component-builder');
const { formatDate, addDays } = require('../../libs/dateHelpers');
const getObjectNameValue = require('../../libs/objectHelpers');
const fetchUnallocatedConfigurationForCaseType = require('../../config/unallocated/unallocatedConfiguration');

const REQUEST_STATUS = {
    COMPLETE: 'Complete',
    CANCELLED: 'Cancelled',
    OVERDUE: 'Overdue',
    DUE: 'Due'
};

const STATUS_OPTION = {
    CANCELLED: [ 'contributionCancelled', 'approvalRequestCancelled' ],
    COMPLETE: [ 'contributionReceived', 'approvalRequestResponseReceived' ],
};

const getRequestStatus = (dueDate, { status, decision }) => {
    if (STATUS_OPTION.CANCELLED.includes(status)) {
        return REQUEST_STATUS.CANCELLED;

    } else if (STATUS_OPTION.COMPLETE.includes(status) && decision) {
        return `${REQUEST_STATUS.COMPLETE} - ${decision}`;

    } else if (STATUS_OPTION.COMPLETE.includes(status)) {
        return REQUEST_STATUS.COMPLETE;

    } else if (addDays(dueDate, 1) < Date.now()) {
        return `${REQUEST_STATUS.OVERDUE} ${formatDate(dueDate)}`;

    } else {
        return `${REQUEST_STATUS.DUE} ${formatDate(dueDate)}`;
    }
};

function parseApprovalRequests(items, choices) {
    return items.map(item => {
        const {
            approvalRequestStatus,
            approvalRequestForBusinessUnit,
            approvalRequestDueDate,
            approvalRequestDecision
        } = item.data;
        const status = getRequestStatus(approvalRequestDueDate, {
            status: approvalRequestStatus,
            decision: approvalRequestDecision
        });
        return `${getChoicesValue({ approvalRequestForBusinessUnit }, choices)} ${status}`;
    }).join(', ');
}

function parseMultipleContributions(items, choices) {
    return items.map(item => {
        const {
            contributionStatus,
            contributionDueDate,
            contributionBusinessUnit,
            contributionBusinessArea
        } = item.data;
        const status = getRequestStatus(contributionDueDate, { status: contributionStatus });
        const contributionTitle = composeContributionTitle(contributionBusinessArea, contributionBusinessUnit, choices);
        return `${contributionTitle} ${status}`;
    }).join(', ');
}

const composeContributionTitle = (contributionBusinessArea, contributionBusinessUnit, choices) => {
    if (contributionBusinessArea && contributionBusinessUnit) {
        return `${getChoicesValue({ contributionBusinessArea }, choices)} - ${getChoicesValue({ contributionBusinessUnit }, choices)}`;
    }
    if (contributionBusinessUnit) {
        return getChoicesValue({ contributionBusinessUnit }, choices);
    }

    return getChoicesValue({ contributionBusinessArea }, choices);
};

const getChoicesValue = (choice, choices) => {
    const [ name, value = '' ] = getObjectNameValue(choice);

    const choiceList = choices[name] ?? [];
    return choiceList.find(item => item.value === value)?.label ?? value;
};

const renderSomuListItems = async ({ caseType, type }, choices, { fromStaticList, fetchList, caseId }) => {
    const somuType = await fromStaticList('SOMU_TYPES', [ caseType, type ]);

    if (somuType && somuType.schema && somuType.schema.renderers) {
        const { unallocated } = somuType.schema.renderers;
        if (unallocated) {

            const somuItems = await fetchList('CASE_SOMU_ITEM', {
                caseId,
                somuTypeId: somuType.uuid
            });

            if (somuItems.length === 0) {
                return;
            }

            switch (unallocated) {
                case 'MultipleContributions': {
                    return parseMultipleContributions(somuItems, choices);
                }
                case 'ApprovalRequests': {
                    return parseApprovalRequests(somuItems, choices);
                }
            }
        }
    }
};

module.exports = async (template, request) => {
    const config = fetchUnallocatedConfigurationForCaseType(template.type);

    let data = template.data;
    if (!config.displayAsFields) {
        data =
            (await Promise.all(
                Object.entries(template.fields).flatMap(([ _, fields ]) => fields) // get a flat array of all the fields in the schema
                    .map(async (fieldTemplate) =>
                        [ fieldTemplate.name, await hydrateFields(fieldTemplate, template.data, request) ]) // hydrate all of the fields
            ))
                .filter(([ _, value ]) => value) // filter out any hidden or empty fields
                .reduce((map, [ name, value ]) => { // assemble the hydrated fields into a object
                    map[name] = value;
                    return map;
                }, {});
    }

    const sections =
        (await Promise.all(Object.entries(template.fields).map(async ([ groupName, fields = [] ]) => {
            if (!config.displayAll) {
                fields = fields.filter(({ name }) => data[name]);
            }

            if (config.displayAsFields) {
                fields = fields.map(fieldTemplate => getField(fieldTemplate));
            } else {
                fields = fields.map(fieldTemplate => getMappedComponentFromField(fieldTemplate));
            }

            return { title: groupName, items: fields };
        }))).filter(({ items }) => items.length > 0);

    const builder = Form()
        .withTitle(template.reference)
        .withNoPrimaryAction();

    if (config.displayHeading) {
        builder.withField(
            Component('heading', 'case-view-heading')
                .withProp('label', 'Case details')
                .build()
        );
    }

    builder.withField(
        Component('accordion', 'case-view')
            .withProp('sections', sections)
            .build()
    );

    return builder.withData(data).build();
}
;

const hydrateFields = async (fieldTemplate, data, request) => {
    const value = data[fieldTemplate.name];

    switch (fieldTemplate.component) {
        case 'date':
            return formatDate(value);
        case 'somu-list':
            return await hydrateSomuList(fieldTemplate.props, data, request);
        case 'checkbox-group':
            return hydrateCheckboxGroup(fieldTemplate.props, data);
        default:
            return value;
    }
};

const hydrateSomuList = async ({ somuType, choices, conditionChoices }, data, request) => {
    if (conditionChoices) {
        for (const { conditionPropertyValue, conditionPropertyName, choices: choicesValue } of conditionChoices) {
            if (conditionPropertyValue === data[conditionPropertyName]) {
                choices = choicesValue;
                break;
            }
        }
    }

    const choiceObj = {};
    if (choices && typeof choices === 'object') {
        for (const [ name, choice ] of Object.entries(choices)) {
            if (choice) {
                Object.assign(choiceObj, { [name]: await request.fetchList(choice) });
            }
        }
    }

    return await renderSomuListItems(somuType, choiceObj, request);

};

const hydrateCheckboxGroup = ({ choices }, data ) => {
    let dataArray = [];

    choices.map( choice => {
        if (Object.prototype.hasOwnProperty.call(choice, 'name') && data[choice.name] === choice.value) {
            dataArray.push(choice.label);
        }
    });

    return dataArray.join(', ');
};

const getMappedComponentFromField = ({ props, component, name, label }) => {
    const { choices, conditionChoices, showLabel, visibilityConditions } = props || {};

    let mappedDisplayComponent = Component('mapped-display', name)
        .withProp('component', component)
        .withProp('label', label)
        .withProp('visibilityConditions', visibilityConditions);

    if (component === 'checkbox') {
        mappedDisplayComponent.withProp('showLabel', showLabel);
    }

    if (component !== 'somu-list') {
        mappedDisplayComponent.withProp('choices', choices);
        mappedDisplayComponent.withProp('conditionChoices', conditionChoices);
    }

    return mappedDisplayComponent.build();
};

const getField = ({ props, component, name, label }) => {
    let displayComponent = Component(component, name)
        .withProp('label', label);

    Object.entries(props ?? {})
        .forEach(([ key, value ]) => {
            displayComponent.withProp(key, value);
        });

    displayComponent.withProp('disabled', true);

    return displayComponent.build();
};
