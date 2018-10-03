const Form = require('./form-builder');
const { Component, Choice } = require('./component-builder');

module.exports = () => Form()
    .withTitle('Test form')
    .withField(
        Component('panel')
            .withProp('title', 'Application complete')
            .withProp('children', 'Everything is excellent')
            .build()
    )
    .withField(
        Component('paragraph')
            .withProp('children', 'The Magic Words are Squeamish Ossifrage.')
            .build()
    )
    .withField(
        Component('text', 'name')
            .withValidator('required', 'Name is required')
            .withProp('label', 'What is your first name?')
            .build()
    )
    .withField(
        Component('text', 'surname')
            .withValidator('required', 'Surname is required')
            .withProp('label', 'What is your surname?')
            .build()
    )
    .withField(
        Component('date', 'date')
            .withValidator('required', 'Date is required')
            .withValidator('isValidDate', 'Invalid date')
            .build())
    .withField(
        Component('checkbox', 'checkboxContext')
            .withValidator('required', 'Choose at least one option')
            .withProp('label', 'Checkbox group')
            .withProp('hint', 'Here\'s a hint')
            .withProp('className', 'inline')
            .withProp('choices', [
                Choice('Test1', 'Has1'),
                Choice('Test2', 'Has2'),
                Choice('Test3', 'Has3')
            ])
            .build()
    )
    .withField(
        Component()
            .withValidator('required', 'This checkbox is required')
            .withProp('className', 'inline')
            .withProp('choices', [
                Choice('Is checked', 'IsChecked')
            ])
            .build()
    )
    .withField(
        Component('inset')
            .withProp('children', 'Doing this thing will make that thing happen.')
            .build()
    )
    .withField(
        Component('text-area', 'text-area')
            .withValidator('required', 'Put some text in the box')
            .withProp('label', 'Text Area')
            .build()
    )
    .withField(
        Component('radio', 'case-type')
            .withValidator('required', 'At least one option is required to continue')
            .withProp('label', 'Radio Group')
            .withProp('hint', 'Here\'s another hint')
            .withProp('className', 'inline')
            .withProp('choices', [
                Choice('A', 'isA'),
                Choice('B', 'isB'),
                Choice('C', 'isC')
            ])
            .build()
    )
    .withField(
        Component('dropdown', 'dropdown-test')
            .withValidator('required', 'Select an option from the dropdown')
            .withProp('label', 'Dropdown')
            .withProp('choices', [
                Choice('Iago', '1'),
                Choice('Desdemona', '2'),
                Choice('Cassio', '3'),
                Choice('Othello', '4'),
                Choice('Roderigo', '5'),
                Choice('Emilia', '6'),
                Choice('Brabantio', '7'),
                Choice('Bianca', '8'),
                Choice('Duke of Venice', '9'),
                Choice('Gratiano', '10'),
                Choice('Lodovico', '11'),
                Choice('Montano', '12'),
                Choice('Clown', '13'),
                Choice('Soldier 1', '14'),
                Choice('Soldier 2', '15'),
                Choice('Soldier 3', '16'),
            ])
            .build()
    )
    .withField(
        Component('type-ahead', 'type-ahead')
            .withValidator('required', 'This field is required')
            .withProp('label', 'Type-ahead')
            .withProp('hint', 'e.g. Choice 1, Choice 2...')
            .withProp('choices', [
                Choice('First group', null, {
                    options: [
                        Choice('Choice 1', 'CHOICE_1_PARENT_1'),
                        Choice('Choice 2', 'CHOICE_2_PARENT_1'),
                        Choice('Choice 3', 'CHOICE_3_PARENT_1'),
                    ]
                }),
                Choice('Second group', null, {
                    options: [
                        Choice('Choice 1', 'CHOICE_1_PARENT_2'),
                        Choice('Choice 2', 'CHOICE_2_PARENT_2')
                    ]
                }),
            ])
            .build()
    )
    .withField(
        Component('entity-list', 'primary-topic')
            .withValidator('required', 'Ensure that a primary topic is selected')
            .withProp('label', 'Primary topic')
            .withProp('entity', 'topic')
            .withProp('hasRemoveLink', true)
            .withProp('hasAddLink', true)
            .withProp('choices', [
                Choice('Topic A', 'TOPIC_A'),
                Choice('Topic B', 'TOPIC_B')
            ])
            .build()
    )
    .withField(
        Component('entity-list', 'primary-correspondent')
            .withValidator('required', 'Ensure that a primary correspondent is selected')
            .withProp('label', 'Primary correspondent')
            .withProp('entity', 'correspondent')
            .withProp('disabled', true)
            .withProp('choices', [
                Choice('Correspondent A', 'CORRESPONDENT_A'),
                Choice('Correspondent B', 'CORRESPONDENT_C'),
                Choice('Correspondent C', 'CORRESPONDENT_C')
            ])
            .build()
    )
    .withPrimaryActionLabel('Submit')
    .build();