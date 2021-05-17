import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const mappings = new Map(choices.map(choice => [choice.value, choice.label]));
        if (component === 'checkbox') {
            return (
                <span className='govuk-body full-width'><strong>{choices[0].label}: </strong><input className="bigger" type="checkbox" disabled="disabled" checked="checked"/></span>
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
