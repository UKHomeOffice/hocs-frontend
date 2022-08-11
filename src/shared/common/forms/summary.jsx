import React  from 'react';
import PropTypes from 'prop-types';

const SummaryRow = ({ label, data, renderer }) => {
    const renderValue = (value, renderer) => {
        switch (renderer) {
            case 'currency': {
                return `£${value}`;
            }
            default: {
                return value;
            }
        }
    };

    return (
        <tr className='govuk-table__cell'>
            <th className='govuk-table__header padding-left--small govuk-!-width-one-half'>{label}</th>
            <td className='govuk-table__cell'>{renderValue(data, renderer)}</td>
        </tr>
    );
};

SummaryRow.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    renderer: PropTypes.string
};

const Summary = ({ summary, data }) => (
    <table className='govuk-table'>
        <caption className='govuk-table__caption margin-bottom--small'>Summary</caption>
        <tbody className='govuk-table__body'>
            { data &&
            summary.map((summaryItem) => {
                const value = data[summaryItem.attribute];
                return value && <SummaryRow key={summaryItem.attribute} data={value} label={summaryItem.label}
                    renderer={summaryItem.renderer} />;
            })
            }
        </tbody>
    </table>
);

Summary.propTypes = {
    summary: PropTypes.array.isRequired,
    data: PropTypes.object
};

Summary.defaultProps = {
    data: { }
};

export default Summary;
