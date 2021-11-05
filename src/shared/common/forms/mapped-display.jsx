import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getMapOfChoicesAndChoiceOptions = (choices) => {

    const optionChoices = choices
        .filter(choice => choice.options)
        .flatMap(choice => choice.options);
    const allChoices = [ ...choices, ...optionChoices ];

    return new Map(allChoices.map(choice => [choice.value, choice.label]));
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
            return (
                <span className='govuk-body full-width'><strong>{choices[0].label}: </strong>Yes</span>
            );
        } else {
            return (
                <span className='govuk-body full-width'><strong>{label}: </strong>{mappings.get(value) ? mappings.get(value) : value}</span>
            );
        }
    }
}

MappedDisplay.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    component: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string
};

MappedDisplay.defaultProps = {
    choices: [],
    component: 'text',
    label: 'MappedDisplay field',
    value: ''
};

export default MappedDisplay;
