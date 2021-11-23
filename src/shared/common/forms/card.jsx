import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const StaticCard = ({ count, children, label }) => (
    <li className='card govuk-body govuk-grid-column-one-quarter'>
        <div className='card__body'>
            <span className='govuk-!-font-size-48'>{count}</span>
            <span className='govuk-!-font-size-19 govuk-!-font-weight-bold'>{label}</span>
        </div>
        {children && <div className='card__footer'>
            {children}
        </div>}
    </li>
);

StaticCard.propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node
};

export const Card = ({ count, children, label, url }) => (
    <li className='card govuk-body govuk-grid-column-one-quarter'>
        <Link to={url} className='card__body'>
            <span className='govuk-!-font-size-48'>{count}</span>
            <span className='govuk-!-font-size-19 govuk-!-font-weight-bold'>{label}</span>
        </Link>
        {children && <div className='card__footer'>
            {children}
        </div>}
    </li>
);

Card.propTypes = {
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Card;