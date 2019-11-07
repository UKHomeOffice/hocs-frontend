const Form = require('../../services/forms/form-builder');
const { Component } = require('../../services/forms/component-builder');

const parseDate = (rawDate) => {
    const [date] = rawDate.match(/[0-9]{4}-[0-1][0-9]-[0-3][0-9]/g) || [];
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const formatDate = (date) => date ? parseDate(date) : null;

module.exports = async (template, { fromStaticList }) => {

    const builder = Form()
        .withTitle(template.caseReference)
        .withNoPrimaryAction();

    const data = {};
    const sections = [];
    const sortedSections = [];

    await Promise.all(Object.entries(template.schema.fields).sort((a,b) => a[0] > b[0]).map(async ([stageId, fields], index) => {

        const stageName = await fromStaticList('S_STAGETYPES', stageId);
        const stageFields = [];

        fields.forEach(fieldTemplate => {
            const { name, label } = fieldTemplate.props;
            const value = template.data[name];

            if (value) {
                data[name] = fieldTemplate.component === 'date' ? formatDate(value) : value;

                stageFields.push(
                    Component('display', name)
                        .withProp('label', label)
                        .build()
                );
            }

        });
        if (stageFields.length > 0) {
            sections.push({ title: stageName, items: stageFields, index });
        }

    }));

    sortedSections.push(...sections.sort((a, b) => a.index - b.index));

    builder.withField(
        Component('heading', 'case-view-heading')
            .withProp('label', 'Case Details')
            .build()
    );
    builder.withField(
        Component('accordion', 'case-view')
            .withProp('sections', sortedSections)
            .build()
    );

    return builder.withData(data).build();
};