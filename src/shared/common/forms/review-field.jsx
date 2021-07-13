import React  from 'react';
import PropTypes from 'prop-types';

const findLabelByValue = (choices, value) => {
    return choices.find(choice => choice.value === value).label;
};


const ReviewField = ({ name, type, value, child, switchDirection, direction }) => {
    let textValue = value;

    if (child.component === 'radio') {
        textValue = findLabelByValue(child.props.choices, value);
    } else if (child.component === 'date') { // todo: extract this logic from workstack adapter
        const date = new Date(value);
        if (isNaN(date) || value == null) {
            textValue = '';
        } else {
            textValue = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
    }

    return (
        <tr className='govuk-table__row'>
            <td className='govuk-table__cell'><span className={'govuk-label govuk-label--s'}>{child.props.label}</span></td>
            <td className={'govuk-table__cell govuk-body'}
                id={name}
                type={type}
                name={name}>
                {textValue}
            </td>
            <td className={'govuk-table__cell govuk-body'}><a className="govuk-body govuk-link change-link" href="" onClick={(e) => {
                e.preventDefault();

                switchDirection(e, direction);
            }}>
                Change <span className={'govuk-visually-hidden'}>{child.props.label}</span>
            </a></td>
        </tr>
    );
};

ReviewField.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    child: PropTypes.object.isRequired,
    submitWithAction: PropTypes.func,
    updateState: PropTypes.func,
    switchDirection: PropTypes.func,
    direction: PropTypes.string
};

ReviewField.defaultProps = {
    label: 'Review field',
    type: 'review-field',
    value: ''
};

export default ReviewField;