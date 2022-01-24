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

const ActionSummaryInterests = (props) => {

    const interests = [ ...props.props.items ];

    if (interests.length < 1) {
        return false;
    }

    return (
        <>
            <h2 className='govuk-heading-m'>Interest</h2>
            { interests.map((item, index) => (
                <>
                    <table className='govuk-table margin-left--small'>
                        <caption className='govuk-table__caption margin-bottom--small'>Interest { index + 1 }</caption>
                        <tbody className='govuk_table__body'>
                            { item.interestedPartyTitle && renderRow({ label: 'Party', value: item.interestedPartyTitle })}
                            { item.detailsOfInterest && renderRow({ label: 'Details', value: item.detailsOfInterest })}
                        </tbody>
                    </table>

                </>
            ))}
        </>
    );
};

export default ActionSummaryInterests;