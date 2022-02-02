import React from 'react';
import PropTypes from 'prop-types';

const renderRow = ({ label, value }) => {
    return (
        <tr key={label} className='govuk-table__row'>
            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>{label}</th>
            <td className='govuk-table__cell'>{value}</td>
        </tr>
    );
};

renderRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

const Interest = ({ interest }) => {
    return (
        <>
            <table className='govuk-table margin-left--small'>
                <caption className='govuk-table__caption margin-bottom--small'>Interest</caption>
                <tbody className='govuk_table__body'>
                    { interest.interestedPartyTitle && renderRow({ label: 'Party', value: interest.interestedPartyTitle })}
                    { interest.detailsOfInterest && renderRow({ label: 'Details', value: interest.detailsOfInterest })}
                </tbody>
            </table>
        </>
    );
};

Interest.propTypes = {
    interest: PropTypes.object.isRequired
};

export default Interest;
