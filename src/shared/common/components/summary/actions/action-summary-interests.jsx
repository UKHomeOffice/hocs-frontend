import React from 'react';
import PropTypes from 'prop-types';
import Interest from './interest.jsx';


const ActionSummaryInterests = ({ items: interests }) => {

    if (interests.length < 1) {
        return false;
    }

    return (
        <>
            <h2 className='govuk-heading-m'>Interest</h2>
            { interests.map((interest, index) => (
                <Interest key = {index} interest = {interest}/>
            ))}
        </>
    );
};

ActionSummaryInterests.propTypes = {
    items: PropTypes.array.isRequired
};

export default ActionSummaryInterests;
