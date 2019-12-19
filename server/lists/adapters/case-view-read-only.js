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

module.exports = async (template) => {

    const builder = Form()
        .withTitle(template.caseReference)
        .withNoPrimaryAction();

    const data = {};
    const sections = [];
    const sortedSections = [];

    await Promise.all(Object.entries(template.schema.fields).map(async ([accordionTitle, fields]) => {

        fields.forEach(fieldTemplate => {
            const { name } = fieldTemplate.props;
            const value = template.data[name];

            data[name] = fieldTemplate.component === 'date' ? formatDate(value) : value;

        });
        if (fields.length > 0) {
            sections.push({ title: accordionTitle, items: fields });
        }

    }));

    sortedSections.push(...sections.sort((a, b) => {
        if (a.title > b.title) {
            return 1;
        } else if (a.title < b.title) {
            return -1;
        } else {
            return 0;
        }
    }));

    builder.withField(
        Component('accordion', 'case-view')
            .withProp('sections', sortedSections)
            .build()
    );

    return builder.withData(data).build();
};