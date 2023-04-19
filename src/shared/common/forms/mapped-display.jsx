import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getMapOfChoicesAndChoiceOptions = (choices) => {

    const optionChoices = choices
        .filter(choice => choice.options)
        .flatMap(choice => choice.options);
    const allChoices = [ ...choices, ...optionChoices ];

    return new Map(allChoices.map(choice => [choice.value, choice.label]));
};

const renderCheckbox = (label, showLabel, choicesLabel) =>  {
    return (
        <div className='govuk-body full-width'><strong>{showLabel ? label : choicesLabel}: </strong>Yes</div>
    );
};

const renderCheckboxGroup = (mappings, value, label) =>  {
    return (
        <div className='govuk-body full-width'><strong>{label}: </strong>{mappings.get(value) ? mappings.get(value) : value.replaceAll(',', ', ')}</div>
    );
};

class MappedDisplay extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            choices,
            component,
            label,
            value
        } = this.props;

        const mappings = getMapOfChoicesAndChoiceOptions(choices);
        if (component === 'checkbox') {
            return (renderCheckbox(label, this.props.showLabel, choices[0].label));
        } if (component === 'checkbox-group') {
            return (renderCheckboxGroup(mappings, value, label));
        } else {
            return (
                <div className='govuk-body full-width'><strong>{label}: </strong>{mappings.get(value) ? mappings.get(value) : value}</div>
            );
        }
    }
}

MappedDisplay.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    component: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    props: PropTypes.object,
    showLabel: PropTypes.bool
};

MappedDisplay.defaultProps = {
    choices: [],
    component: 'text',
    label: 'MappedDisplay field',
    value: '',
    props: {},
    showLabel: false
};

export default MappedDisplay;
