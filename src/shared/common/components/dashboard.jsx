import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Card, { StaticCard } from '../forms/card.jsx';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    constructUrl(item) {
        const { baseUrl } = this.props;
        return `${baseUrl}/${item.type}/${item.value}`;
    }

    render() {
        const { absoluteUrl, dashboard, alwaysLink } = this.props;

        return (
            <Fragment>
                <ul className='govuk-grid-row dashboard__teams'>
                    {dashboard && dashboard.length > 0 && dashboard.map((item, i) => {
                        const url = absoluteUrl ? absoluteUrl : this.constructUrl(item);
                        if (alwaysLink || dashboard.length > 1) {
                            return (
                                <Card key={i} url={url} {...item}>
                                    {item.tags && item.tags.allocated && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag'>{item.tags.allocated} Unallocated</span>}
                                    {item.tags && item.tags.overdue && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag dashboard__tag--red'>{item.tags.overdue} Overdue</span>}
                                </Card>
                            );
                        } else {
                            return (
                                <StaticCard key={i} {...item}>
                                    {item.tags && item.tags.allocated && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag'>{item.tags.allocated} Unallocated</span>}
                                    {item.tags && item.tags.overdue && <span className='govuk-!-font-size-16 govuk-!-font-weight-bold govuk-tag dashboard__tag dashboard__tag--red'>{item.tags.overdue} Overdue</span>}
                                </StaticCard>
                            );
                        }
                    })}
                </ul>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    absoluteUrl: PropTypes.string,
    baseUrl: PropTypes.string,
    dashboard: PropTypes.array.isRequired,
    alwaysLink: PropTypes.bool
};

Dashboard.defaultProps = {
    baseUrl: '/workstack',
    alwaysLink: false
};

export default Dashboard;
