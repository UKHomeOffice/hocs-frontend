import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const findLabelByValue = (choices, value) => {
    return choices.find(choice => choice.value === value).label;
};

function renderChangeDirectionLink(child, switchDirection, direction) {
    return <>
        <a className="govuk-body govuk-link change-link" href="" onClick={(e) => {
            e.preventDefault();
            switchDirection(e, direction);
        }}>
            Change <span className={'govuk-visually-hidden'}>{child.props.label}</span>
        </a>
    </>;
}

function renderChangeEntityLink(child, page, value, caseType) {
    const caseTypeParam = caseType ? caseType + '/' : '';

    return <>
        <Link to={`/case/${page.caseId}/stage/${page.stageId}/entity/${child.props.entity}/${value}/${caseTypeParam}update?hideSidebar=false`}
            className="govuk-link">
            Change <span className={'govuk-visually-hidden'}>{child.props.label}</span>
        </Link>
    </>;
}

const ReviewField = ({ name, type, value, child, switchDirection, direction, page, caseType }) => {
    const changeLineBuilder = ChangeAttributeBuilder();

    switch(child.component){
        case 'radio':
        case 'dropdown':
        case 'type-ahead':
            changeLineBuilder.addValue(findLabelByValue(child.props.choices, value));
            changeLineBuilder.withChangeLink(renderChangeDirectionLink(child, switchDirection, direction));
            break;

        case 'entity-list':
            changeLineBuilder.addValue(findLabelByValue(child.props.choices, value));
            changeLineBuilder.withChangeLink(renderChangeEntityLink(child, page, value, caseType));
            break;

        case 'date':
            // eslint-disable-next-line no-case-declarations
            const date = new Date(value);

            if (isNaN(date) || value == null) {
                changeLineBuilder.addValue('');

            } else {
                changeLineBuilder
                    .addValue(`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                        .toString().padStart(2, '0')}/${date.getFullYear()}`);
            }
            changeLineBuilder.withChangeLink(renderChangeDirectionLink(child, switchDirection, direction));

            break;

        case 'checkbox-grid':
            value.split(',').forEach(checkboxValue => {
                changeLineBuilder.addValue(findLabelByValue(child.props.choices, checkboxValue));
            });

            changeLineBuilder.withChangeLink(renderChangeDirectionLink(child, switchDirection, direction));

            break;
        default:
            changeLineBuilder.addValue(value);
            changeLineBuilder.withChangeLink(renderChangeDirectionLink(child, switchDirection, direction));
    }

    return (
        changeLineBuilder
            .withName(name)
            .withType(type)
            .withLabel(child.props.label)
            .build()
    );
};

function ChangeAttributeBuilder() {

    return {
        values: [],

        withName: function(name) {
            this.name = name;
            return this;
        },
        withLabel: function(label) {
            this.label = label;
            return this;
        },
        withType: function(type) {
            this.type = type;
            return this;
        },
        addValue: function(value) {
            this.values.push(value);
            return this;
        },
        withChangeLink: function(changeLink) {
            this.changeLink = changeLink;
            return this;
        },
        build: function build() {
            return <div className='review-field'>
                {this.values.map((value, index) => {
                    return <div key={`${index}`} className='govuk-grid-row review-field-row'>
                        <div className='govuk-grid-column-one-half'>
                            <span className={'govuk-label govuk-label--s'}>
                                {index === 0 && this.label /* only display the label alongside the first value */}
                            </span>
                        </div>
                        <div className={'govuk-grid-column-one-third govuk-body review-field-column'}
                            id={this.name}
                            type={this.type}
                            name={this.name}>
                            {value}
                        </div>

                        <div className={'grid-column-one-sixth-right-align govuk-body review-field-column'}>
                            {this.changeLink}
                        </div>
                    </div>;
                })}
            </div>;
        }
    };
}


ReviewField.propTypes = {
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

ReviewField.defaultProps = {
    label: 'Review field',
    type: 'review-field',
    value: ''
};

export default ReviewField;