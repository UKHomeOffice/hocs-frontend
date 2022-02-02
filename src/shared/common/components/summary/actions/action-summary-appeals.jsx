import React from 'react';
import PropTypes from 'prop-types';
import Appeal from './appeal.jsx';

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
    value: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
};

const ActionSummaryAppeals = ({ items: appeals }) => {

    if (appeals.length < 1) {
        return false;
    }

    return (
        <>
            <h2 className='govuk-heading-m'>Appeals</h2>
            { appeals.map((item, index) => (
                <Appeal key = {index} appeal = {item}/>
            ))}
        </>
    );
};

export default ActionSummaryAppeals;