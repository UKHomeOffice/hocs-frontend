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
        <div className="govuk-summary-list__row">
            <dt className='govuk-summary-list__key padding-left--small govuk-!-width-one-half'>{label}</dt>
            <dt className='govuk-summary-list__value'>{renderValue(data, renderer)}</dt>
        </div>
    );
};

SummaryRow.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    renderer: PropTypes.string
};

const Summary = ({ summary, data }) => (
    <dl className="govuk-summary-list">
        <caption className='govuk-table__caption margin-bottom--small'>Summary</caption>
        { data &&
        summary.map((summaryItem) => {
            const value = data[summaryItem.attribute];
            return value && <SummaryRow key={summaryItem.attribute} data={value} label={summaryItem.label}
                renderer={summaryItem.renderer} />;
        })
        }
    </dl>
);

Summary.propTypes = {
    summary: PropTypes.array.isRequired,
    data: PropTypes.object
};

Summary.defaultProps = {
    data: { }
};

export default Summary;
