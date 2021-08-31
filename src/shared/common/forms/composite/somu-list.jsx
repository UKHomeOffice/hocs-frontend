import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

const REQUEST_STATUS = {
    COMPLETE: 'COMPLETE',
    CANCELLED: 'CANCELLED',
    OVERDUE: 'OVERDUE',
    DUE: 'DUE'
};

const TABLE_TYPE = {
    CONTRIBUTION: 'contribution',
    APPROVAL: 'approval'
};

const STATUS_OPTION = {
    CANCELLED: ['contributionCancelled', 'approvalRequestCancelled'],
    COMPLETE: ['contributionReceived', 'approvalRequestResponseReceived'],
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

    getRequestStatus(dueDate, status) {
        if (STATUS_OPTION.CANCELLED.includes(status)) {
            return REQUEST_STATUS.CANCELLED;
        } else if (STATUS_OPTION.COMPLETE.includes(status)) {
            return REQUEST_STATUS.COMPLETE;
        } else if (this.addDays(dueDate, 1) < Date.now()) {
            return REQUEST_STATUS.OVERDUE;
        } else {
            return REQUEST_STATUS.DUE;
        }
    }

    composeTitle(choices, titleBusinessLabelData) {
        const { businessArea, businessUnit } = titleBusinessLabelData;

        console.log(JSON.stringify(titleBusinessLabelData));

        if (businessArea && businessUnit) {
            return `${businessArea} - ${this.loadValue(businessUnit, choices)}`;
        }

        if (businessArea && !businessUnit) {
            return `${businessArea}`;
        }
        return `${this.loadValue(businessUnit, choices)}`;
    }

    renderContributionTable(somuItem) {
        const { choices } = this.state;
        const { contributionStatus, contributionBusinessArea, contributionBusinessUnit, contributionDueDate } = somuItem;

        const title = this.composeTitle(choices, { businessArea: contributionBusinessArea, businessUnit: contributionBusinessUnit } );
        const contributionStatusEnum = this.getRequestStatus(contributionDueDate, contributionStatus);
        return this.renderTable(contributionStatusEnum, title, contributionDueDate, TABLE_TYPE.CONTRIBUTION);
    }

    renderApprovalTable(somuItem) {
        const { choices } = this.state;
        const { approvalRequestStatus, approvalRequestForBusinessUnit, approvalRequestDueDate, approvalRequestDecision } = somuItem;
        const title = this.composeTitle(choices, { businessUnit: approvalRequestForBusinessUnit });
        const approvalRequestResponseStatusEnum = this.getRequestStatus(approvalRequestDueDate, approvalRequestStatus);
        return this.renderTable(approvalRequestResponseStatusEnum, title, approvalRequestDueDate, TABLE_TYPE.APPROVAL, approvalRequestDecision);
    }

    renderTable(status, title, dueDate, tableType, decision = undefined) {
        return (<>
            <td className='govuk-table__cell'>
                <label className={'govuk-label'}
                    aria-label={status === REQUEST_STATUS.CANCELLED ? `Cancelled ${tableType} request: ${title}` : title}
                    title={status === REQUEST_STATUS.CANCELLED ? `Cancelled ${tableType} request: ${title}` : title}>
                    {title}
                </label>
            </td>
            {this.renderStatusColumn(status, dueDate, decision)}
        </>);
    }

    renderStatusColumn(status, requestDueDate, decision = undefined) {
        let className = '';
        let title = '';

        switch (status) {
            case REQUEST_STATUS.COMPLETE:
                title = !decision ? 'Complete' : 'Complete - ' + decision;
                break;
            case REQUEST_STATUS.OVERDUE:
                className = 'date-warning';
                title = `Overdue ${this.formatDate(requestDueDate)}`;
                break;
            case REQUEST_STATUS.DUE: {
                title = `Due ${this.formatDate(requestDueDate)}`;
                break;
            }
            case REQUEST_STATUS.CANCELLED: {
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
                return this.renderContributionTable(somuItem.data);
            }
            case 'CompTable': {
                return this.renderContributionTable(somuItem.data);
            }
            case 'FoiTable': {
                return this.renderContributionTable(somuItem.data);
            }
            case 'ApprovalRequestTable':
                return this.renderApprovalTable(somuItem.data);
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

        this.props.updateState({ [name]: JSON.stringify(somuItems) });
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
                            {somuItems && Array.isArray(somuItems) && somuItems.map((somuItem, i) => {
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
