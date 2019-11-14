import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class EntityManager extends Component {
    constructor(props) {
        super(props);
    }

    renderTable(choices, label) {
        const {
            baseUrl,
            entity,
            hasDownloadLink,
            hasRemoveLink,
            hasTemplateLink
        } = this.props;

        return (
            <Fragment key={label}>
                {label && <h2 className='govuk-heading-m'>{label}</h2>}
                <table className='govuk-table'>
                    <tbody className='govuk-table__body'>
                        {Array.isArray(choices) && choices.map((choice, i) => {
                            return (
                                <tr className='govuk-radios govuk-table__row' key={i}>
                                    {choice.tags && <td className='govuk-table__cell' >
                                        {choice.tags.map((tag, i) => <strong key={i} className='govuk-tag margin-right--small'>{tag}</strong>)}
                                    </td>}
                                    <td className='govuk-table__cell'>
                                        {choice.label}
                                    </td>
                                    {choice.created && <td className='govuk-table__cell'>
                                        {new Date(choice.created).toLocaleDateString()}
                                    </td>}
                                    {hasDownloadLink && <td className='govuk-table__cell'>
                                        <a href={`${baseUrl}/download/${entity}/${choice.value}`} className="govuk-link" download={choice.label}>Download</a>
                                    </td>}
                                    {hasTemplateLink && <td className='govuk-table__cell'>
                                        <a href={`${baseUrl}/template`} className="govuk-link" download={choice.label}>Download</a>
                                    </td>}
                                    {hasRemoveLink && <td className='govuk-table__cell'>
                                        <a href={`${baseUrl}/entity/${entity}/${choice.value}/remove`} className="govuk-link">Remove</a>
                                    </td>}
                                </tr>
                            );
                        })}
                        {choices.length === 0 && <tr className='govuk-table__row'>
                            <td className='govuk-table__cell'>None</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </Fragment>
        );
    }

    render() {
        const {
            baseUrl,
            choices,
            entity,
            hasAddLink,
            isGrouped,
            label
        } = this.props;
        return (
            <Fragment>
                {isGrouped ? choices.map(([label, choice]) => this.renderTable.bind(this)(choice, label)) : this.renderTable.bind(this)(choices, label)}
                {hasAddLink && <Link to={`${baseUrl}/entity/${entity}/add`} className="govuk-body govuk-link">{`Add ${entity}`}</Link>}
            </Fragment>
        );
    }
}

EntityManager.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    choices: PropTypes.array,
    className: PropTypes.string,
    entity: PropTypes.string.isRequired,
    hasAddLink: PropTypes.bool,
    hasRemoveLink: PropTypes.bool,
    hasDownloadLink: PropTypes.bool,
    hasTemplateLink: PropTypes.bool,
    isGrouped: PropTypes.bool,
    label: PropTypes.string
};

EntityManager.defaultProps = {
    entity: 'entity',
    choices: []
};

export default EntityManager;