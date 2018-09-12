import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class EntityManager extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        const {
            baseUrl,
            choices,
            entity,
            hasAddLink,
            hasRemoveLink
        } = this.props;
        return (
            <Fragment>
                <table className='govuk-table'>
                    <tbody className='govuk-table__body'>
                        {choices && choices.map((choice, i) => {
                            return (
                                <tr className='govuk-radios govuk-table__row' key={i}>
                                    {choice.tags && <td className='govuk-table__cell' >
                                        {choice.tags.map((tag, i) => <strong key={i} className='govuk-tag margin-right--small'>{tag}</strong>)}
                                    </td>}
                                    <td className='govuk-table__cell'>
                                        {choice.label}
                                    </td>
                                    <td className='govuk-table__cell'>
                                        {hasRemoveLink && <Link to={`${baseUrl}/${entity}/${choice.value}/remove`} className="govuk-link">Remove</Link>}
                                    </td>
                                </tr>
                            );
                        })}
                        {choices.length === 0 && <p className='govuk-body'>No Data.</p>}
                    </tbody>
                </table>
                {hasAddLink && <Link to={`${baseUrl}/${entity}/add`} className="govuk-body govuk-link">{`Add ${entity}`}</Link>}
            </Fragment>
        );
    }
}

EntityManager.propTypes = {
    baseUrl: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    entity: PropTypes.string.isRequired,
    hasAddLink: PropTypes.bool,
    hasRemoveLink: PropTypes.bool
};

EntityManager.defaultProps = {
    entity: 'entity',
    choices: []
};

export default EntityManager;