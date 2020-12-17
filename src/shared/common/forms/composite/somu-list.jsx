import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

class SomuList extends Component {

    constructor(props) {
        super(props);

        this.state = { ...props };
    }

    componentDidMount() {
        const { name, somuItems } = this.props;

        this.props.updateState({ [name]: somuItems.data });
    }

    loadValue(value, choices) {
        const choice = choices.find(x => x.value === value);

        return choice ? choice.label : value;
    }

    renderIdRow(schema, somuItem) {
        const renderers = schema.renderers;
        const choices = this.props.choices;

        if (renderers) {
            const tableRenderer = renderers.table || '';
            switch (tableRenderer) {
                case 'MpamTable': {
                    return (<td className='govuk-table__cell'>
                        <label className="govuk-label">{somuItem.businessArea} - {this.loadValue(somuItem.businessUnit, choices)}</label>
                    </td>);
                }
            }
        }
        return (<td className='govuk-table__cell'>
            <label className="govuk-label">{somuItem.uuid}</label>
        </td>);
    }

    renderItemLinks(somuItem) {
        const { itemLinks, somuType, page, hideSidebar }  = this.props;

        if (itemLinks && Array.isArray(itemLinks)) {
            const links = itemLinks.map(({ action, label }, i) => {
                return (<td key={i} className='govuk-table__cell'>
                    <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/somu/${somuType.uuid}/${somuType.type}/${somuType.caseType}/item/${somuItem.uuid}/${action}?hideSidebar=${hideSidebar}`}
                        className="govuk-link">{label}</Link>
                </td>);
            });
            return links;
        }
        return undefined;
    }

    render() {
        const {
            page,
            somuType,
            somuItems,
            disabled,
            error,
            primaryLink,
            label,
            name,
            className
        } = this.props;

        const { hideSidebar } = this.props;

        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                    <table className='govuk-table'>
                        <tbody className='govuk-table__body'>
                            {somuItems && somuItems.data != null && somuItems.data.length > 0 && somuItems.data.map((somuItem, i) => {
                                return (
                                    <tr className='govuk-table__row' key={i}>
                                        { this.renderIdRow(somuType.schema, somuItem) }
                                        { this.renderItemLinks(somuItem) }
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {primaryLink &&
                        <p>
                            <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/somu/${somuType.uuid}/${somuType.type}/${somuType.caseType}/${primaryLink.action}?hideSidebar=${hideSidebar}`} className="govuk-body govuk-link">{primaryLink.label}</Link>
                        </p>
                    }
                </fieldset>

            </div>
        );
    }
}

SomuList.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    className: PropTypes.string,
    somuType: PropTypes.object.isRequired,
    somuItems: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    itemLinks: PropTypes.arrayOf(PropTypes.object),
    primaryLink: PropTypes.object,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired,
    hideSidebar: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
};

SomuList.defaultProps = {
    choices: [],
    somuType: {},
    somuItems: {},
    disabled: false,
    page: {},
    hideSidebar: false,
};

const WrappedSomuList = props => (
    <ApplicationConsumer>
        {({ page }) => <SomuList {...props} page={page} />}
    </ApplicationConsumer>
);

export default WrappedSomuList;
