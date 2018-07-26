import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Inset extends Component {
    /*
     *  Bordered inset text to draw attention to important content on the page.
     */
    render() {
        const { children } = this.props;

        return (
            <p className="govuk-inset-text">{children}</p>
        );
    }
}

Inset.propTypes = {
    children: PropTypes.node
};

Inset.defaultProps = {
};