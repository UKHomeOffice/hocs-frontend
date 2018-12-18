import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TextLink = ({ target, label, className }) => (
    <div className='margin-bottom--small'>
        <Link className={`govuk-link${className ? ' ' + className : ''}`} to={target} >
            {label}
        </Link>
    </div>
);

TextLink.propTypes = {
    target: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default TextLink;