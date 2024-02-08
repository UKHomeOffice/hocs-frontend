import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';
import { addDaysToDate, parseIso8601Date } from '../../../helpers/dateHelpers';
import { getObjectNameValue } from '../../../helpers/objectHelpers';

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

    constructor(renderer, choices ) {
        this.state = { renderer, choices };
    }

    getRequestStatus(dueDate, status) {
        if (STATUS_OPTION.CANCELLED.includes(status)) {
            return REQUEST_STATUS.CANCELLED;
        } else if (STATUS_OPTION.COMPLETE.includes(status)) {
            return REQUEST_STATUS.COMPLETE;
        } else if (addDaysToDate(dueDate, 1) < Date.now()) {
            return REQUEST_STATUS.OVERDUE;
        } else {
            return REQUEST_STATUS.DUE;
        }
    }

    composeContributionTitle(contributionBusinessArea, contributionBusinessUnit) {
        if (contributionBusinessArea && contributionBusinessUnit) {
            return `${this.getChoicesValue({ contributionBusinessArea })} - ${this.getChoicesValue({ contributionBusinessUnit }) }`;
        }
        if (contributionBusinessUnit) {
            return this.getChoicesValue({ contributionBusinessUnit });
        }

        return this.getChoicesValue({ contributionBusinessArea });
    }

    getChoicesValue(choice) {
        const { choices } = this.state;
        const [name, value = ''] = getObjectNameValue(choice);

        const choiceList = choices[name] ?? [];
        return choiceList.find(item => item.value === value)?.label ?? value;
    }

    renderContributionTable(somuItem){
        const { contributionStatus, contributionBusinessArea, contributionBusinessUnit, contributionDueDate } = somuItem;

        const title = this.composeContributionTitle(contributionBusinessArea, contributionBusinessUnit);
        const contributionStatusEnum = this.getRequestStatus(contributionDueDate, contributionStatus);
        return this.renderTable(contributionStatusEnum, title, contributionDueDate, TABLE_TYPE.CONTRIBUTION);
    }

    renderApprovalTable(somuItem) {
        const { approvalRequestStatus, approvalRequestForBusinessUnit, approvalRequestDueDate, approvalRequestDecision } = somuItem;
        const title = this.getChoicesValue({ approvalRequestForBusinessUnit });
        const approvalRequestResponseStatusEnum = this.getRequestStatus(approvalRequestDueDate, approvalRequestStatus);
        return this.renderTable(approvalRequestResponseStatusEnum, title, approvalRequestDueDate, TABLE_TYPE.APPROVAL, approvalRequestDecision);
    }

    renderTable(status, title, dueDate, tableType, decision = undefined) {
        const metaLabel = status === REQUEST_STATUS.CANCELLED ? `Cancelled ${tableType} request: ${title}` : title;
        const elementTitle = TABLE_TYPE.CONTRIBUTION ? 'Contribution type' : 'Approval type';
        return (<>
            <dt className="govuk-summary-list__key">
                <span className={'govuk-label'}
                    aria-label={metaLabel}
                    title={elementTitle}>
                    {title}
                </span>
            </dt>
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
                title = `Overdue ${parseIso8601Date(requestDueDate)}`;
                break;
            case REQUEST_STATUS.DUE: {
                title = `Due ${parseIso8601Date(requestDueDate)}`;
                break;
            }
            case REQUEST_STATUS.CANCELLED: {
                title = 'Cancelled';
                break;
            }
        }

        return (<dd className={`govuk-summary-list__value ${className}`}>
            <span className='govuk-label'
                aria-label={title}>
                {title}
            </span>
        </dd>);
    }

    render(somuItem) {
        const { renderer } = this.state;

        switch (renderer) {
            case 'MpamTable':
            case 'CompTable':
            case 'FoiTable':
            case 'PogrTable': {
                return this.renderContributionTable(somuItem.data);
            }
            case 'ApprovalRequestTable':
                return this.renderApprovalTable(somuItem.data);
        }

        return (<dt className="govuk-summary-list__key">
            <label className="govuk-label">{somuItem.uuid}</label>
        </dt>);
    }

}

class SomuList extends Component {
    constructor(props) {
        super(props);

        const tableRender =  props.somuType?.schema?.renderers?.table ?? '';

        this.state = { ...props, renderer: new SomuTableRenderer(tableRender, props.choices) };
    }

    componentDidMount() {
        const { name, somuItems } = this.props;

        this.props.updateState({ [name]: JSON.stringify(somuItems) });
    }

    renderItemLinks(somuItem) {
        const { itemLinks, somuType, page, hideSidebar }  = this.props;

        return itemLinks.map(({ action, label }) => {
            return (<dd key={action} className="govuk-summary-list__actions">
                <Link to={`/case/${page.params.caseId}/stage/${page.params.stageId}/somu/${somuType.uuid}/${somuType.type}/${somuType.caseType}/item/${somuItem.uuid}/${action}?hideSidebar=${hideSidebar}`}
                    className="govuk-link">{label}</Link>
            </dd>);
        });
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
            className,
            hint
        } = this.props;

        const { renderer } = this.state;

        const { hideSidebar } = this.props;

        return (
            <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>

                <fieldset id={name} className={`govuk-fieldset ${className ? className : ''}`} disabled={disabled} aria-describedby={error ? `${name}-error` : ''}>

                    <legend id={`${name}-legend`} className="govuk-fieldset__legend">
                        <span className="govuk-fieldset__heading govuk-label--s">{label}</span>
                    </legend>

                    {hint && <div className="govuk-hint">{hint}</div>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}

                    <dl className="govuk-summary-list">
                        {somuItems.map((somuItem, i) => {
                            return (
                                <div className="govuk-summary-list__row" key={i}>
                                    {
                                        renderer.render(somuItem)
                                    }
                                    { this.renderItemLinks(somuItem) }
                                </div>
                            );
                        })}
                    </dl>
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
    choices: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hideSidebar: PropTypes.bool.isRequired,
    itemLinks: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    page: PropTypes.object.isRequired,
    primaryLink: PropTypes.object,
    somuItems: PropTypes.array,
    somuType: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    hint: PropTypes.string
};

SomuList.defaultProps = {
    choices: {},
    disabled: false,
    hideSidebar: false,
    itemLinks: [],
    page: {},
    somuItems: [],
    somuType: {}
};

const WrappedSomuList = props => (
    <ApplicationConsumer>
        {({ page }) =>
            <SomuList
                {...props}
                page={page}
            />}
    </ApplicationConsumer>
);

export default WrappedSomuList;
