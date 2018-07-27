import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Paragraph extends Component {
    render() {
        const { children } = this.props;

        return (
            <p className="govuk-body">{children}</p>
        );
    }
}

Paragraph.propTypes = {
    children: PropTypes.node
};