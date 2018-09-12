const Form = require('./form-builder');

module.exports = () => Form()
    .withTitle('Test form')
    .withField({
        component: 'panel',
        props: {
            title: 'Application complete',
            children: 'Everything is excellent'
        }
    })
    .withField({
        component: 'paragraph',
        props: {
            children: 'The Magic Words are Squeamish Ossifrage.'
        }
    })
    .withField({
        component: 'text',
        validation: [
            'required'
        ],
        props: {
            name: 'name',
            label: 'Name'
        }
    })
    .withField({
        component: 'text',
        validation: [
            'required'
        ],
        props: {
            name: 'surname',
            label: 'Surname'
        }
    })
    .withField({
        component: 'date',
        validation: [
            'required',
            'isValidDate'
        ],
        props: {
            name: 'date',
            label: 'Date'
        }
    })
    .withField({
        component: 'checkbox',
        validation: [
            'required'
        ],
        props: {
            name: 'checkboxContext',
            label: 'Checkbox Group',
            hint: 'Here\'s a hint',
            className: 'inline',
            choices: [
                {
                    label: 'Test1',
                    value: 'Has1'
                },
                {
                    label: 'Test2',
                    value: 'Has2'
                },
                {
                    label: 'Test3',
                    value: 'Has3'
                }
            ]
        }
    })
    .withField({
        component: 'checkbox',
        validation: [
            'required'
        ],
        props: {
            name: 'checkbox',
            className: 'inline',
            choices: [
                {
                    label: 'Is checked',
                    value: 'IsChecked'
                }
            ]
        }
    })
    .withField({
        component: 'inset',
        props: {
            children: 'Doing this thing will make that thing happen.'
        }
    })
    .withField({
        component: 'text-area',
        validation: [
            'required'
        ],
        props: {
            name: 'text-area',
            label: 'Text Area'
        }
    })
    .withField({
        component: 'radio',
        validation: [
            'required'
        ],
        props: {
            name: 'case-type',
            label: 'Radio Group',
            hint: 'Here\'s a hint',
            className: 'inline',
            choices: [
                {
                    label: 'A',
                    value: 'isA'
                },
                {
                    label: 'B',
                    value: 'isB'
                },
                {
                    label: 'C',
                    value: 'isC'
                }
            ]
        }
    })
    .withField({
        component: 'dropdown',
        validation: [
            'required'
        ],
        props: {
            name: 'dropdown-test',
            label: 'Dropdown',
            choices: [
                {
                    value: '1',
                    label: 'Iago'
                },
                {
                    value: '2',
                    label: 'Desdemona'
                },
                {
                    value: '3',
                    label: 'Cassio'
                },
                {
                    value: '4',
                    label: 'Othello'
                },
                {
                    value: '5',
                    label: 'Roderigo'
                },
                {
                    value: '6',
                    label: 'Emilia'
                },
                {
                    value: '7',
                    label: 'Brabantio'
                },
                {
                    value: '8',
                    label: 'Bianca'
                },
                {
                    value: '9',
                    label: 'Duke of Venice'
                },
                {
                    value: '10',
                    label: 'Gratiano'
                },
                {
                    value: '11',
                    label: 'Lodovico'
                },
                {
                    value: '12',
                    label: 'Montano'
                },
                {
                    value: '13',
                    label: 'Clown'
                },
                {
                    value: '14',
                    label: 'Soldier 1'
                },
                {
                    value: '15',
                    label: 'Soldier 2'
                },
                {
                    value: '16',
                    label: 'Soldier 3'
                }
            ]
        }
    })
    .withField({
        component: 'entity-list',
        validation: [
            'required'
        ],
        props: {
            name: 'primary_topic',
            label: 'Topic',
            action: 'TOPIC',
            hasRemoveLink: true,
            hasAddLink: true,
            choices: [
                {
                    label: 'Topic A',
                    value: 'TOPIC_A'
                },
                {
                    label: 'Topic B',
                    value: 'TOPIC_B'
                }
            ]
        }
    })
    .withField({
        component: 'entity-list',
        validation: [
            'required'
        ],
        props: {
            name: 'primary_correspondent',
            label: 'Correspondent',
            disabled: true,
            action: 'CORRESPONDENT',
            choices: [
                {
                    label: 'Correspondent A',
                    value: 'CORRESPONDENT_A'
                },
                {
                    label: 'Correspondent B',
                    value: 'CORRESPONDENT_B'
                }
            ]
        }
    })
    .withPrimaryActionLabel('Submit')
    .build();