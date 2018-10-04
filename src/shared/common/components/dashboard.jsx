import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import Card from '../forms/card.jsx';

const my_cases = { label: 'Cases', count: 9, tags: { overdue: 1 } };

const cases = [
    {
        label: 'Performance and process team',
        value: 'DCU_PPT',
        items: [
            {
                label: 'DCU Ministerial',
                value: 'DCU_MIN',
                items: [
                    { label: 'Data Entry', value: 'DATA_ENTRY', count: 5, tags: { allocated: 2 } },
                    { label: 'Dispatch', value: 'DISPATCH', count: 3 }
                ]
            },
            {
                label: 'DCU Treat official',
                value: 'DCU_TRO',
                items: [
                    { label: 'Dispatch', value: 'DISPATCH', count: 2, tags: { allocated: 1 } }
                ]
            }
        ]
    },
    {
        label: 'Central drafting team',
        value: 'DCU_CDT',
        items: [
            {
                label: 'DCU Ministerial',
                value: 'DCU_MIN',
                items: [
                    { label: 'Draft', value: 'DRAFT', count: 2, tags: { overdue: 2 } },
                    { label: 'QA', value: 'QA', count: 6, tags: { allocated: 2, overdue: 3 } },
                ]
            },
            {
                label: 'DCU Treat official',
                value: 'DCU_TRO',
                items: []
            }
        ]
    },
    {
        label: 'Transfers and No.10 team',
        value: 'DCU_TNT',
        items: []
    }
];

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    renderNoItems() {
        return (
            <p className='govuk-body govuk-grid-column-full'>No items to display</p>
        );
    }

    renderStages(stages, location) {
        return (
            <Fragment>
                {stages && stages.length > 0 ? stages.map((s, i) => {
                    const url = `${location}/stage/${s.value}`;
                    return (
                        <Card key={i} url={url} {...s}>
                            {s.tags && s.tags.overdue && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag dashboard__tag--red'>{s.tags.overdue} Overdue</span>}
                            {s.tags && s.tags.allocated && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag'>{s.tags.allocated} Allocated</span>}
                        </Card>
                    );
                }) : this.renderNoItems()}
            </Fragment>
        );
    }

    renderWorkflows(workflows, location) {
        return (
            <Fragment>
                {workflows && workflows.length > 0 ? workflows.map((w, i) => {
                    const url = `${location}/workflow/${w.value}`;
                    return (
                        <li className='govuk-grid-column-full dashboard__workflows--item' key={i}>
                            <h4 className='govuk-heading-s' >
                                {w.label}
                                {w.items && w.items.length > 0 && <Link to={url} className='govuk-body govuk-link margin-left--small'>view</Link>}
                            </h4>
                            <ul className='govuk-grid-row dashboard__stages'>
                                {w.items && this.renderStages(w.items, url)}
                            </ul>
                        </li>
                    );
                }) : this.renderNoItems()}
            </Fragment>
        );
    }

    renderTeams(cases, location) {
        return (
            <Fragment>
                {cases && cases.length > 0 ? cases.map((c, i) => {
                    const url = `${location}/team/${c.value}`;
                    return (
                        <li className='govuk-grid-column-full dashboard__teams--item' key={i}>
                            <h3 className='govuk-heading-m' >
                                {c.label}
                                {c.items && c.items.length > 0 && <Link to={url} className='govuk-body govuk-link margin-left--small'>view</Link>}
                            </h3>
                            <ul className='govuk-grid-row dashboard__workflows'>
                                {c.items && this.renderWorkflows(c.items, url)}
                            </ul>
                        </li>
                    );
                }) : this.renderNoItems()}
            </Fragment>
        );
    }

    render() {
        const { baseUrl } = this.props;

        return (
            <Fragment>
                <h2 className='govuk-heading-l'>My work</h2>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full dashboard__todo'>
                        <Card url={'/workstack/user'} {...my_cases}>
                            {my_cases.tags && my_cases.tags.overdue &&
                                <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag dashboard__tag--red'>
                                    {my_cases.tags.overdue} Overdue
                                </span>
                            }
                        </Card>
                    </div>
                </div>
                <h2 className='govuk-heading-l'>My teams work</h2>
                <ul className='govuk-grid-row dashboard__teams'>
                    {cases && this.renderTeams(cases, baseUrl)}
                </ul>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    baseUrl: PropTypes.string
};

Dashboard.defaultProps = {
    baseUrl: '/workstack'
};

const WrappedDashboard = props => (
    <ApplicationConsumer>
        {() => <Dashboard {...props} />}
    </ApplicationConsumer>
);

export default WrappedDashboard;