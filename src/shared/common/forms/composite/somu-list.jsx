import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

const CONTRIBUTION_STATUS = {
    COMPLETE: 'COMPLETE',
    CANCELLED: 'CANCELLED',
    OVERDUE: 'OVERDUE',
    DUE: 'DUE'
};

class SomuTableRenderer {

    constructor(renderer, choices) {
        this.state = { renderer, choices };
    }

    parseDate(rawDate){
        const [date] = rawDate.match(/\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/g) || [];
        if (!date) {
            return null;
        }
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }

    formatDate(date) {
        return date ? this.parseDate(date) : null;
    }

    loadValue(value, choices) {
        const choice = choices.find(x => x.value === value);
        return choice ? choice.label : value;
    }

    addDays(dateString, days) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date;
    }

    getContributionStatus({ contributionDueDate, contributionStatus }) {
        if (contributionStatus === 'contributionCancelled') {
            return CONTRIBUTION_STATUS.CANCELLED;
        } else if (contributionStatus === 'contributionReceived') {
            return CONTRIBUTION_STATUS.COMPLETE;
        } else if (this.addDays(contributionDueDate, 1) < Date.now()) {
            return CONTRIBUTION_STATUS.OVERDUE;
        } else {
            return CONTRIBUTION_STATUS.DUE;
        }
    }

    renderMpamContribution(somuItem) {
        const { choices } = this.state;
        const title = `${somuItem.contributionBusinessArea} - ${this.loadValue(somuItem.contributionBusinessUnit, choices)}`;
        const contributionStatus = this.getContributionStatus(somuItem);

        return (<>
            <td className='govuk-table__cell'>
                <label className={'govuk-label'}
                    aria-label={contributionStatus === CONTRIBUTION_STATUS.CANCELLED ? `Cancelled Contribution: ${title}`: title}
                    title={contributionStatus === CONTRIBUTION_STATUS.CANCELLED ? `Cancelled Contribution: ${title}`: title}>
                    {title}
                </label>
            </td>
            {this.renderStatusColumn(contributionStatus, somuItem)}
        </>);
    }

    renderStatusColumn(status, { contributionDueDate }) {
        let className = '';
        let title = '';

        switch (status) {
            case CONTRIBUTION_STATUS.COMPLETE:
                title = 'Complete';
                break;
            case CONTRIBUTION_STATUS.OVERDUE:
                className = 'date-warning';
                title = `Overdue ${this.formatDate(contributionDueDate)}`;
                break;
            case CONTRIBUTION_STATUS.DUE: {
                title = `Due ${this.formatDate(contributionDueDate)}`;
                break;
            }
            case CONTRIBUTION_STATUS.CANCELLED: {
                title = 'Cancelled';
                break;
            }
        }

        return (<td className={`govuk-table__cell ${className}`}>
            <label className='govuk-label'
                aria-label={title}
                title={title}>
                {title}
            </label>
        </td>);
    }

    render(somuItem) {
        const { renderer } = this.state;

        switch (renderer) {
            case 'MpamTable': {
                return this.renderMpamContribution(somuItem.data);
            }
        }

        return (<td className='govuk-table__cell'>
            <label className="govuk-label">{somuItem.uuid}</label>
        </td>);
    }

}

class SomuList extends Component {
    constructor(props) {
        super(props);

        let tableRender = '';

        if (props.somuType &&
            props.somuType.schema &&
            props.somuType.schema.renderers &&
            props.somuType.schema.renderers.table) {
            tableRender = props.somuType.schema.renderers.table;
        }

        this.state = { ...props, renderer: new SomuTableRenderer(tableRender, props.choices) };
    }

    componentDidMount() {
        const { name, somuItems } = this.props;

        this.props.updateState({ [name]: somuItems });
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

        const { renderer } = this.state;

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
                            {somuItems && Array.isArray(somuItems) &&somuItems.map((somuItem, i) => {
                                return (
                                    <tr className='govuk-table__row' key={i}>
                                        {
                                            renderer.render(somuItem)
                                        }
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
    somuItems: PropTypes.array,
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
    somuItems: [],
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
