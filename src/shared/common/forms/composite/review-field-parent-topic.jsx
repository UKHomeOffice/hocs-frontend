import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const flattenParentTopicMap = (parentTopicChoices) => {
    let flatMap = [...parentTopicChoices];
    for (const choice of parentTopicChoices) {
        if (choice.options && Array.isArray(choice.options)) {
            flatMap = [...flatMap, ...choice.options];
        }
    }
    return flatMap;
};

const findLabelByValue = (choices, value) => {
    return flattenParentTopicMap(choices).find(choice => choice.value === value).label;
};

const renderChangeDirectionLink = (child, switchDirection, direction) => {
    return <>
        <a className="govuk-body govuk-link change-link" href="" onClick={(e) => {
            e.preventDefault();
            switchDirection(e, direction);
        }}>
            Change <span className={'govuk-visually-hidden'}>{child.props.label}</span>
        </a>
    </>;
};

const renderChangeEntityLink = (child, page, value, caseType) => {
    const caseTypeParam = caseType ? caseType + '/' : '';

    return <>
        <Link to={`/case/${page.caseId}/stage/${page.stageId}/entity/${child.props.entity}/${value}/${caseTypeParam}update?hideSidebar=false`}
            className="govuk-link">
            Change <span className={'govuk-visually-hidden'}>{child.props.label}</span>
        </Link>
    </>;
};

const ParentTopicReviewField = ({ name, type, value, child, switchDirection, direction, page, caseType }) => {
    let textValue = value;
    if (child.component === 'radio' || child.component === 'dropdown' || child.component === 'entity-list' || child.component === 'type-ahead') {
        textValue = findLabelByValue(child.props.choices, value);
    } else if (child.component === 'date') {
        const date = new Date(value);
        if (isNaN(date) || value == null) {
            textValue = '';
        } else {
            textValue = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
    }

    return (
        <div className='govuk-grid-row grey-border-bottom'>
            <div className='govuk-grid-column-one-half'><span className={'govuk-label govuk-label--s'}>{child.props.label}</span></div>
            <div className={'govuk-grid-column-one-third govuk-body review-field-column'}
                id={name}
                type={type}
                name={name}>
                {textValue}
            </div>
            <div className={'grid-column-one-sixth-right-align govuk-body review-field-column'}>
                {child.component === 'entity-list' && renderChangeEntityLink(child, page, value, caseType)}
                {child.component !== 'entity-list' && renderChangeDirectionLink(child, switchDirection, direction)}
            </div>
        </div>
    );
};

ParentTopicReviewField.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    child: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    submitWithAction: PropTypes.func,
    updateState: PropTypes.func,
    switchDirection: PropTypes.func,
    direction: PropTypes.string,
    caseType: PropTypes.string
};

ParentTopicReviewField.defaultProps = {
    label: 'Review field',
    type: 'review-field',
    value: ''
};

export default ParentTopicReviewField;