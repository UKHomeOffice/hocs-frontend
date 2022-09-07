const Form = require('../../services/forms/form-builder');
const { Component } = require('../../services/forms/component-builder');
const { formatDate, addDays } = require('../../libs/dateHelpers');
const getObjectNameValue = require('../../libs/objectHelpers');

const REQUEST_STATUS = {
    COMPLETE: 'Complete',
    CANCELLED: 'Cancelled',
    OVERDUE: 'Overdue',
    DUE: 'Due'
};

const STATUS_OPTION = {
    CANCELLED: ['contributionCancelled', 'approvalRequestCancelled'],
    COMPLETE: ['contributionReceived', 'approvalRequestResponseReceived'],
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
        const { approvalRequestStatus, approvalRequestForBusinessUnit, approvalRequestDueDate, approvalRequestDecision } = item.data;
        const status = getRequestStatus(approvalRequestDueDate, { status: approvalRequestStatus, decision: approvalRequestDecision });
        return `${getChoicesValue({ approvalRequestForBusinessUnit }, choices)} ${status}`;
    }).join(', ');
}

function parseMultipleContributions(items, choices) {
    return items.map(item => {
        const { contributionStatus, contributionDueDate, contributionBusinessUnit, contributionBusinessArea } = item.data;
        const status = getRequestStatus(contributionDueDate, { status: contributionStatus });
        const contributionTitle = composeContributionTitle(contributionBusinessArea, contributionBusinessUnit, choices);
        return `${contributionTitle} ${status}`;
    }).join(', ');
}

const composeContributionTitle = (contributionBusinessArea, contributionBusinessUnit, choices) => {
    if (contributionBusinessArea && contributionBusinessUnit) {
        return `${getChoicesValue({ contributionBusinessArea }, choices)} - ${getChoicesValue({ contributionBusinessUnit }, choices) }`;
    }
    if (contributionBusinessUnit) {
        return getChoicesValue({ contributionBusinessUnit }, choices);
    }

    return getChoicesValue({ contributionBusinessArea }, choices);
};

const getChoicesValue = (choice, choices) => {
    const [name, value = ''] = getObjectNameValue(choice);

    const choiceList = choices[name] ?? [];
    return choiceList.find(item => item.value === value)?.label ?? value;
};

const renderSomuListItems = async ( { caseType, type }, choices, { fromStaticList, fetchList, caseId }) => {
    const somuType = await fromStaticList('SOMU_TYPES', [caseType, type]);

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
    const builder = Form()
        .withTitle(template.caseReference)
        .withNoPrimaryAction();

    const data = (await Promise.all(Object.entries(template.schema.fields)
        .flatMap(([_, fields]) => fields) // get a flat array of all the fields in the schema
        .map(async (fieldTemplate) => { // hydrate all of the fields
            const { name } = fieldTemplate.props;

            return [name, await hydrateFields(fieldTemplate, template, name, request)];
        }, {})))
        .filter(([_, value]) => value) // filter out any hidden or empty fields
        .reduce((map, [name, value]) => { // assemble the hydrated fields into a map
            map[name] = value;

            return map;
        }, {});

    const sections =
        (await Promise.all(Object.entries(template.schema.fields).map(async ([stageId, fields]) => {

            const stageFields = fields
                .filter(({ props }) => props && data[props.name])
                .map(fieldTemplate => getComponentFromField(fieldTemplate))
                .filter(component => component !== undefined); // remove empty elements caused by hidden fields .etc
            const stageName = await request.fromStaticList('S_STAGETYPES', stageId);

            return { title: stageName, items: stageFields };
        }))).filter(stage => {
            return stage.items && stage.items.length > 0;
        }); // filter out empty sections

    builder.withField(
        Component('heading', 'case-view-heading')
            .withProp('label', 'Case Details')
            .build()
    );
    builder.withField(
        Component('accordion', 'case-view')
            .withProp('sections', sections)
            .build()
    );

    return builder.withData(data).build();
};

const hydrateFields = async (fieldTemplate, template, name, request) => {
    if (fieldTemplate.component === 'hidden') {
        return;
    }

    if (fieldTemplate.component === 'somu-list') {
        const { somuType, choices } = fieldTemplate.props;
        const choiceObj = {};

        if (choices && typeof choices === 'object') {
            for (const [name, choice] of Object.entries(choices)) {
                if (choice) {
                    Object.assign(choiceObj, { [name]: await request.fetchList(choice) });
                }
            }
        }

        return await renderSomuListItems(somuType, choiceObj, request);
    }

    const value = template.data[name];
    if (value) {
        switch (fieldTemplate.component) {
            case 'date':
                return formatDate(value);
            default:
                return value;
        }
    }
};

const getComponentFromField = ( { props, component }) => {
    const { name, label, choices, conditionChoices } = props;

    if (component === 'hidden') {
        return;
    }

    let mappedDisplayComponent = Component('mapped-display', name)
        .withProp('component', component)
        .withProp('label', label)
        .withProp('conditionChoices', conditionChoices);

    if (component !== 'somu-list') {
        mappedDisplayComponent.withProp('choices', choices);
    }

    if (component === 'checkbox') {
        mappedDisplayComponent.withProp('showLabel', props.showLabel);
    }

    return mappedDisplayComponent.build();
};
