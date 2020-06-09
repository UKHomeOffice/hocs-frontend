import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MappedDisplay extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            choices,
            label,
            value
        } = this.props;
        const mappings = new Map(choices.map(choice => [choice.value, choice.label]));
        return (
            <span className='govuk-body full-width'><strong>{label}: </strong>{mappings.get(value) ? mappings.get(value) : value}</span>
        );
    }
}

MappedDisplay.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    value: PropTypes.string
};

MappedDisplay.defaultProps = {
    choices: [],
    label: 'MappedDisplay field',
    value: ''
};

export default MappedDisplay;