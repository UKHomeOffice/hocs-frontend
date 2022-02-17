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

const Appeal = ({ appeal }) => {
    return (
        <>
            <table className='govuk-table margin-left--small'>
                <caption className='govuk-table__caption margin-bottom--small'>{appeal.title}</caption>
                <tbody className='govuk_table__body'>
                    { appeal.officerDirectorate && renderRow({ label: 'Directorate', value: appeal.officerDirectorate })}
                    { appeal.officer && renderRow({ label: 'Officer Name', value: appeal.officer })}
                    { appeal.status && renderRow({ label: 'Completed', value: appeal.status })}
                    { appeal.dateSentRMS && renderRow({ label: 'Completion date', value: appeal.dateSentRMS })}
                    { appeal.outcome && renderRow({ label: 'Outcome', value: appeal.outcome })}
                    { appeal.complexCase && renderRow({ label: 'Complex case', value: appeal.complexCase })}
                    { appeal.note && renderRow({ label: 'Details', value: appeal.note })}
                </tbody>
            </table>
        </>
    );
};

Appeal.propTypes = {
    appeal: PropTypes.object.isRequired
};

export default Appeal;
