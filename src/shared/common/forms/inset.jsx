import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Inset extends Component {
    /*
     *  Bordered inset text to draw attention to important content on the page.
     */
    render() {
        const { children, value } = this.props;

        return (
            <p className="govuk-inset-text">{children} {value}</p>
        );
    }
}

Inset.propTypes = {
    children: PropTypes.node,
    value: PropTypes.string
};

Inset.defaultProps = {
};