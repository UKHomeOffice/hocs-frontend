import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Card extends Component {
    render() {
        const { count, children, label, url } = this.props;

        return (
            <Fragment>
                <li className='card govuk-body govuk-grid-column-one-quarter'>
                    <Link to={url} className='card__body'>
                        <span className='govuk-!-font-size-48'>{count}</span>
                        <span className='govuk-!-font-size-19 govuk-!-font-weight-bold'>{label}</span>
                    </Link>
                    {children && <div className='card__footer'>
                        {children}
                    </div>}
                </li>
            </Fragment>
        );
    }
}

Card.propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    url: PropTypes.string.isRequired,
    children: PropTypes.node
};