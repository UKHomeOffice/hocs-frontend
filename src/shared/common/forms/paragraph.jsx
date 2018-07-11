import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Paragraph extends Component {
    render() {
        const { content } = this.props;

        return (
            <p>{content}</p>
        );
    }
}

Paragraph.propTypes = {
    content: PropTypes.string,
    phase: PropTypes.string
};

Paragraph.defaultProps = {
    content: ''
};