import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Panel extends Component {
    /*
     *  Bordered inset text to draw attention to important content on the page.
     */
    render() {
        const { content, width } = this.props;

        return (
            <p className={`panel panel-border-${width}`}>{content}</p>
        );
    }
}

Panel.propTypes = {
    content: PropTypes.string,
    width: PropTypes.string
};

Panel.defaultProps = {
    content: '',
    width: 'wide'
};