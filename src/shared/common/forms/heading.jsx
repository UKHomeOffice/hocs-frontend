import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ label }) => (
    <h2 className='govuk-heading-m'>
        {label}
    </h2>
);

Heading.propTypes = {
    label: PropTypes.string.isRequired
};

export default Heading;