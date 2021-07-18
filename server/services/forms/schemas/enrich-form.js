const Form = require('../form-builder');
const { Component, Choice } = require('../component-builder');
const getLogger = require('../../../libs/logger');

const receivedByMethodOptions = [{
    label: 'Email',
    value: 'EMAIL'
}, {
    label: 'Post',
    value: 'POST'
}];

// const countryList = [
//     'Afghanistan',
//     'Albania',
//     'Algeria',
//     'Andorra',
//     'Angola',
//     'Antigua and Barbuda',
//     'Argentina',
//     'Armenia',
//     'Australia',
//     'Austria',
//     'Azerbaijan',
//     'The Bahamas',
//     'Bahrain',
//     'Bangladesh',
//     'Barbados',
//     'Belarus',
//     'Belgium',
//     'Belize',
//     'Benin',
//     'Bhutan',
//     'Bolivia',
//     'Bosnia and Herzegovina',
//     'Botswana',
//     'Brazil',
//     'Brunei',
//     'Bulgaria',
//     'Burkina Faso',
//     'Burundi',
//     'Cabo Verde',
//     'Cambodia',
//     'Cameroon',
//     'Canada',
//     'Central African Republic',
//     'Chad',
//     'Chile',
//     'China',
//     'Colombia',
//     'Comoros',
//     'Congo, Democratic Republic of the',
//     'Congo, Republic of the',
//     'Costa Rica',
//     'Côte d’Ivoire',
//     'Croatia',
//     'Cuba',
//     'Cyprus',
//     'Czech Republic',
//     'Denmark',
//     'Djibouti',
//     'Dominica',
//     'Dominican Republic',
//     'East Timor (Timor-Leste)',
//     'Ecuador',
//     'Egypt',
//     'El Salvador',
//     'Equatorial Guinea',
//     'Eritrea',
//     'Estonia',
//     'Eswatini',
//     'Ethiopia',
//     'Fiji',
//     'Finland',
//     'France',
//     'Gabon',
//     'The Gambia',
//     'Georgia',
//     'Germany',
//     'Ghana',
//     'Greece',
//     'Grenada',
//     'Guatemala',
//     'Guinea',
//     'Guinea-Bissau',
//     'Guyana',
//     'Haiti',
//     'Honduras',
//     'Hungary',
//     'Iceland',
//     'India',
//     'Indonesia',
//     'Iran',
//     'Iraq',
//     'Ireland',
//     'Israel',
//     'Italy',
//     'Jamaica',
//     'Japan',
//     'Jordan',
//     'Kazakhstan',
//     'Kenya',
//     'Kiribati',
//     'Korea, North',
//     'Korea, South',
//     'Kosovo',
//     'Kuwait',
//     'Kyrgyzstan',
//     'Laos',
//     'Latvia',
//     'Lebanon',
//     'Lesotho',
//     'Liberia',
//     'Libya',
//     'Liechtenstein',
//     'Lithuania',
//     'Luxembourg',
//     'Madagascar',
//     'Malawi',
//     'Malaysia',
//     'Maldives',
//     'Mali',
//     'Malta',
//     'Marshall Islands',
//     'Mauritania',
//     'Mauritius',
//     'Mexico',
//     'Micronesia, Federated States of',
//     'Moldova',
//     'Monaco',
//     'Mongolia',
//     'Montenegro',
//     'Morocco',
//     'Mozambique',
//     'Myanmar (Burma)',
//     'Namibia',
//     'Nauru',
//     'Nepal',
//     'Netherlands',
//     'New Zealand',
//     'Nicaragua',
//     'Niger',
//     'Nigeria',
//     'North Macedonia',
//     'Norway',
//     'Oman',
//     'Pakistan',
//     'Palau',
//     'Panama',
//     'Papua New Guinea',
//     'Paraguay',
//     'Peru',
//     'Philippines',
//     'Poland',
//     'Portugal',
//     'Qatar',
//     'Romania',
//     'Russia',
//     'Rwanda',
//     'Saint Kitts and Nevis',
//     'Saint Lucia',
//     'Saint Vincent and the Grenadines',
//     'Samoa',
//     'San Marino',
//     'Sao Tome and Principe',
//     'Saudi Arabia',
//     'Senegal',
//     'Serbia',
//     'Seychelles',
//     'Sierra Leone',
//     'Singapore',
//     'Slovakia',
//     'Slovenia',
//     'Solomon Islands',
//     'Somalia',
//     'South Africa',
//     'Spain',
//     'Sri Lanka',
//     'Sudan',
//     'Sudan, South',
//     'Suriname',
//     'Sweden',
//     'Switzerland',
//     'Syria',
//     'Taiwan',
//     'Tajikistan',
//     'Tanzania',
//     'Thailand',
//     'Togo',
//     'Tonga',
//     'Trinidad and Tobago',
//     'Tunisia',
//     'Turkey',
//     'Turkmenistan',
//     'Tuvalu',
//     'Uganda',
//     'Ukraine',
//     'United Arab Emirates',
//     'United Kingdom',
//     'United States',
//     'Uruguay',
//     'Uzbekistan',
//     'Vanuatu',
//     'Vatican City',
//     'Venezuela',
//     'Vietnam',
//     'Yemen',
//     'Zambia',
//     'Zimbabwe'
// ];

/**
 * Create the fields for the case creation stage.
 */
const enrichmentDataFormFields = {
    ACTION: {
        CREATE: {
            DOCUMENT: {
                FOI: {
                    add: () => Form()
                        .withField(
                            Component('date', 'KimuDateReceived')
                                .withValidator('required', 'Date correspondence received in KIMU is required')
                                .withValidator('isValidDate', 'Date correspondence received in KIMU must be a valid date')
                                .withValidator('isBeforeToday', 'Date correspondence received in KIMU cannot be in the future')
                                .withProp('label', 'Date correspondence received in KIMU')
                                .withProp('hint', 'For example, 30 01 2021')
                                .build()
                        )
                        .withField(
                            Component('radio', 'OriginalChannel', receivedByMethodOptions)
                                .withValidator('required')
                                .withProp('label', 'How was the request received?')
                                .withProp('choices', [
                                    Choice('Email', 'EMAIL', {
                                        conditionalContentAfterTitle: 'Correspondent Details', conditionalContentAfter: [
                                            { type: 'textarea', name: 'Fullname', label: 'Full Name', rows: '1' },
                                            {
                                                type: 'dropdown', name: 'Country', label: 'Country', choices: [
                                                    { label: 'United Kingdom', value: 'United Kingdom', },
                                                    { label: 'Other', value: 'Other' }
                                                ]
                                            },
                                            { type: 'textarea', name: 'Email', label: 'Email Address', rows: '1' },
                                            { type: 'textarea', name: 'Reference', label: 'Requester\'s Reference (Optional)', rows: '1' }
                                        ]
                                    }),
                                    Choice('Post', 'POST', {
                                        conditionalContentAfterTitle: 'Correspondent Details', title: 'Correspondent Details', conditionalContentAfter: [
                                            { type: 'textarea', name: 'Fullname', label: 'Full Name', rows: '1' },
                                            { type: 'textarea', name: 'Address1', label: 'Building', rows: '1' },
                                            { type: 'textarea', name: 'Address2', label: 'Street', rows: '1' },
                                            { type: 'textarea', name: 'Address3', label: 'Town or City', rows: '1' },
                                            { type: 'textarea', name: 'Fullname', label: 'Postcode', rows: '1' },
                                            { type: 'dropdown', name: 'Postcode', label: 'Country', choices: [
                                                { label: 'United Kingdom', value: 'United Kingdom' },
                                                { label: 'Other', value: 'Other' }
                                            ] },
                                            { type: 'textarea', name: 'Email', label:'Email Address (Optional)', rows: '1' },
                                            { type: 'textarea', name: 'Reference', label:'Requester\'s Reference (Optional)', rows: '1' }
                                        ]
                                    })
                                ])
                                .build()
                        )
                        .withField(
                            Component('text-area', 'RequestQuestion')
                                .withValidator('required')
                                .withProp('label', 'Request Question')
                                .build()
                        )
                        .withData({
                            'KimuDateReceived': new Date().toISOString().substr(0, 10)
                        })
                        .build()
                }
                ,
                MIN: {
                    add: () => Form()
                        .withField(
                            Component('text-area', 'RequestQuestion')
                                .withValidator('required')
                                .withProp('label', 'Request Question')
                                .build()
                        )
                        .build()
                }
            }
        }
    }
};

module.exports.enrich = (context, workflow, action, entity) => {
    const logger = getLogger();
    const dataFields = enrichmentDataFormFields;
    const fieldsToAdd = dataFields[context.toUpperCase()][workflow.toUpperCase()][action.toUpperCase()][entity.toUpperCase()];
    logger.info('GET_FORM_ENRICHMENTS', { context, workflow, action, entity });
    if (fieldsToAdd && fieldsToAdd.add) {
        return [...fieldsToAdd.add().schema.fields];
    }
    logger.debug('NO_FORM_ENRICHMENTS_FOUND', { context, workflow, action, entity });
    return {};
};
