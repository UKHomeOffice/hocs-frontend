const Form = require('../../services/forms/form-builder');
const { Component } = require('../../services/forms/component-builder');
const { formatDate, addDays } = require('../../libs/dateHelpers');

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

const loadValue = async (value, choices, fromStaticList) => {
    const choice = await fromStaticList(choices, value);
    return choice ? Promise.resolve(choice) : Promise.resolve(value);
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

async function composeBusinessLabel(choices, { businessArea, businessUnit }, fromStaticList) {
    const businessUnitLabel = await loadValue(businessUnit, choices, fromStaticList);
    return businessArea ? `${businessArea} - ${businessUnitLabel}` : businessUnitLabel;
}

async function getApprovalsStrings(approvalsArray, choices, fromStaticList) {
    return await Promise.all(approvalsArray.map(async (approval) => {
        const { approvalRequestStatus, approvalRequestForBusinessUnit, approvalRequestDueDate, approvalRequestDecision } = approval.data;
        const approvalStatus = getRequestStatus(approvalRequestDueDate, { status: approvalRequestStatus, decision: approvalRequestDecision });
        const businessLabel = await composeBusinessLabel(
            choices,
            { businessUnit: approvalRequestForBusinessUnit },
            fromStaticList
        );

        return `${businessLabel} ${approvalStatus}`;
    }));
}

async function getContributionStrings(contributions, choices, fromStaticList) {
    return await Promise.all(contributions.map(async (contribution) => {
        const { contributionStatus, contributionDueDate, contributionBusinessUnit, contributionBusinessArea } = contribution.data;
        const status = getRequestStatus(contributionDueDate, { status: contributionStatus });
        const businessLabel = await composeBusinessLabel(
            choices,
            { businessArea: contributionBusinessArea, businessUnit: contributionBusinessUnit },
            fromStaticList
        );

        return `${businessLabel} ${status}`;
    }));
}

async function parseApprovalRequests(approvalsJSONString, choices, fromStaticList) {
    const approvalsArray = JSON.parse(approvalsJSONString);
    const arrayOfApprovalStrings = await getApprovalsStrings(approvalsArray, choices, fromStaticList);
    return arrayOfApprovalStrings.join(', ');
}

async function parseMultipleContributions (value, choices, fromStaticList) {
    const contributions = JSON.parse(value);
    const contributionStrings = await getContributionStrings(contributions, choices, fromStaticList);
    return contributionStrings.join(', ');
}

const renderSomuListItems = async ( { caseType, type, choices }, value, fromStaticList) => {
    const somuType = await fromStaticList('SOMU_TYPES', [caseType, type]);

    if (somuType && somuType.schema && somuType.schema.renderers) {
        const { unallocated } = somuType.schema.renderers;

        if (unallocated) {
            switch (unallocated) {
                case 'MultipleContributions': {
                    const values = await parseMultipleContributions(value, choices, fromStaticList);
                    return values;
                }
                case 'ApprovalRequests': {
                    const values = await parseApprovalRequests(value, choices, fromStaticList);
                    return values;
                }
            }
        }
    }

    return value;
};

module.exports = async (template, { fromStaticList }) => {
    const builder = Form()
        .withTitle(template.caseReference)
        .withNoPrimaryAction();

    const sections =
        (await Promise.all(Object.entries(template.schema.fields).map(async ([stageId, fields]) => {

            const stageFields = fields.map(
                fieldTemplate => getComponentFromField(fieldTemplate, template))
                .filter(component => component !== undefined); // remove empty elements caused by hidden fields .etc
            const stageName = await fromStaticList('S_STAGETYPES', stageId);

            return { title: stageName, items: stageFields };
        }))).filter(stage => {
            return stage.items && stage.items.length > 0;
        }); // filter out empty sections

    const data = (await Promise.all(Object.entries(template.schema.fields)
        .flatMap(([_, fields]) => fields) // get a flat array of all the fields in the schema
        .map(async (fieldTemplate) => { // hydrate all of the fields
            const { name } = fieldTemplate.props;

            return [name, await hydrateFields(fieldTemplate, template, fromStaticList, name)];
        }, {})))
        .filter(([_, value]) => value) // filter out any hidden or empty fields
        .reduce((map, [name, value]) => { // assemble the hydrated fields into a map
            map[name] = value;

            return map;
        }, {});

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

const hydrateFields = async (fieldTemplate, template, fromStaticList, name) => {
    const { somuType } = fieldTemplate.props;
    const value = template.data[name];
    let hydratedValue;

    if (fieldTemplate.component !== 'hidden') {
        if (value) {
            switch (fieldTemplate.component) {
                case 'date':
                    hydratedValue = formatDate(value);
                    break;
                case 'somu-list': {
                    const somuString = await renderSomuListItems(somuType, value, fromStaticList);
                    hydratedValue = somuString;
                    break;
                }
                default:
                    hydratedValue = value;
            }
        }

        return hydratedValue;
    }
};

const getComponentFromField = (fieldTemplate, template) => {
    const { name, label, choices, conditionChoices } = fieldTemplate.props;
    const value = template.data[name];

    if (fieldTemplate.component !== 'hidden') {
        if (value) {
            return (
                Component('mapped-display', name)
                    .withProp('component', fieldTemplate.component)
                    .withProp('label', label)
                    .withProp('choices', choices)
                    .withProp('conditionChoices', conditionChoices)
                    .build()
            );
        }
    }
};

