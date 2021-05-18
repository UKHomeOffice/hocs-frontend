const Form = require('../../services/forms/form-builder');
const { Component } = require('../../services/forms/component-builder');
const { formatDate, addDays } = require('../../libs/dateHelpers');

const loadValue = async (value, choices, fromStaticList) => {
    const choice = await fromStaticList(choices, value);
    return choice ? Promise.resolve(choice) : Promise.resolve(value);
};

const getContributionStatusString = ({ contributionDueDate, contributionStatus }) => {
    if (contributionStatus === 'contributionCancelled') {
        return 'Cancelled';
    } else if (contributionStatus === 'contributionReceived') {
        return 'Complete';
    } else if (addDays(contributionDueDate, 1) < Date.now()) {
        return `Overdue ${formatDate(contributionDueDate)}`;
    } else {
        return `Due ${formatDate(contributionDueDate)}`;
    }
};

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
            }
        }
    }

    return value;
};

const parseMultipleContributions = async (value, choices, fromStaticList) => {
    const contributions = JSON.parse(value);
    const contributionStrings = await Promise.all(contributions.map(async (contribution) => {
        const { contributionStatus, contributionDueDate, contributionBusinessUnit, contributionBusinessArea } = contribution.data;
        const status = getContributionStatusString({ contributionDueDate, contributionStatus });
        const values = await loadValue(contributionBusinessUnit, choices, fromStaticList);
        const title = `${contributionBusinessArea} - ${values} (${status})`;
        return title;
    }));

    return contributionStrings.join(', ');
};

module.exports = async (template, { fromStaticList }) => {
    const builder = Form()
        .withTitle(template.caseReference)
        .withNoPrimaryAction();

    const data = {};
    const sections = [];

    await Promise.all(Object.entries(template.schema.fields).map(async ([stageId, fields]) => {
        const stageName = await fromStaticList('S_STAGETYPES', stageId);
        const stageFields = [];

        await Promise.all(fields.map(async fieldTemplate => {
            const { name, label, choices, conditionChoices, somuType } = fieldTemplate.props;
            const value = template.data[name];

            if (fieldTemplate.component !== 'hidden') {
                if (value) {
                    switch (fieldTemplate.component) {
                        case 'date':
                            data[name] = formatDate(value);
                            break;
                        case 'somu-list': {
                            const somuString = await renderSomuListItems(somuType, value, fromStaticList);
                            data[name] = somuString;
                            break;
                        }
                        default:
                            data[name] = value;
                    }

                    stageFields.push(
                        Component('mapped-display', name)
                            .withProp('label', label)
                            .withProp('choices', choices)
                            .withProp('conditionChoices', conditionChoices)
                            .build()
                    );
                }
            }

        }));
        if (stageFields.length > 0) {
            sections.push({ title: stageName, items: stageFields });
        }

    }));

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
