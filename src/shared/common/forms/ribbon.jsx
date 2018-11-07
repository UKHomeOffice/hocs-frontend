import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Ribbon extends Component {
    render() {
        const { title, children } = this.props;

        return (
            <div className="ribbon">
                <h1>{title}</h1>
                <div>{children}</div>
            </div>
        );
    }
}

Ribbon.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
};
