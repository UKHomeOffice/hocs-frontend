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

const ActionSummaryAppeals = (props) => {

    const appeals = [ ...props.props.items ];

    if (appeals.length < 1) {
        return false;
    }

    return (
        <>
            <h2 className='govuk-heading-m'>Appeals</h2>
            { appeals.map(item => (
                <>
                    <table className='govuk-table margin-left--small'>
                        <caption className='govuk-table__caption margin-bottom--small'>{item.title}</caption>
                        <tbody className='govuk_table__body'>
                            { item.officerDirectorate && renderRow({ label: 'Directorate', value: item.officerDirectorate })}
                            { item.officer && renderRow({ label: 'Officer Name', value: item.officer })}
                            { item.status && renderRow({ label: 'Completed', value: item.status })}
                            { item.dateSentRMS && renderRow({ label: 'Completion date', value: item.dateSentRMS })}
                            { item.outcome && renderRow({ label: 'Outcome', value: item.outcome })}
                            { item.complexCase && renderRow({ label: 'Complex case', value: item.complexCase })}
                            { item.note && renderRow({ label: 'Details', value: item.note })}
                        </tbody>
                    </table>

                </>
            ))}
        </>
    );
};

export default ActionSummaryAppeals;