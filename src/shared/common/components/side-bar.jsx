import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPanel from './document-panel.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';
import People from './people.jsx';
import CaseActions from './case-actions.jsx';
import TabExGratia from './tab-ex-gratia.jsx';
import updateCaseTabs from '../../helpers/case-tabs-helpers';

class SideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: props.activeTab
        };
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');

        if(tabParam) {
            this.setState(  {
                active: tabParam
            });
        } else {
            this.updateActiveTab();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.page.params !== this.props.page.params) {
            this.updateTabs();
        }
        this.updateActiveTab();
    }

    setActive(e, tab) {
        e.preventDefault();
        this.setState({ active: tab });
    }

    isActive(tab) {
        return this.state.active === tab;
    }

    renderTabButton(label, value) {
        const { page } = this.props;
        return (
            <li key={value} className={this.isActive(value) ? 'govuk-tabs__list-item govuk-tabs__list-item--selected' : 'govuk-tabs__list-item'}>
                <Link onClick={(e) => this.setActive(e, value)} className={'govuk-tabs__tab'} to={`${page.url}/?activeTab=${value}`}>
                    {label}
                </Link>
            </li>
        );
    }

    renderActiveTab() {
        const { active } = this.state;

        const tab = this.getTabConfig(active);

        const renderTab = (tab) => {
            return (<div className={'govuk-tabs__panel'}> {tab} </div>);
        };

        switch(tab?.type) {
            case 'DOCUMENTS':
                return renderTab(<DocumentPanel />);
            case 'SUMMARY':
                return renderTab(<StageSummary />);
            case 'TIMELINE':
                return renderTab(<CaseNotes />);
            case 'PEOPLE':
                return renderTab(<People />);
            case 'ACTIONS':
                return renderTab(<CaseActions />);
            case 'EX_GRATIA':
                return renderTab(<TabExGratia screen={tab.screen} />);
            default: return null;
        }
    }

    updateTabs() {
        const { page, dispatch } = this.props;
        if (page && page.params && page.params.caseId) {
            updateCaseTabs(page.params.caseId, dispatch);
        }
        this.updateActiveTab();
    }

    updateActiveTab() {
        const { caseTabs } = this.props;
        const { active } = this.state;

        if (caseTabs && caseTabs.length > 0 && !active) {
            this.setState({ active: caseTabs[0].type });
        }
    }

    getTabConfig(type) {
        const { caseTabs } = this.props;

        return caseTabs
            .find(tab => tab.type === type);
    }


    render() {
        return (
            <Fragment>
                { this.props.caseTabs && <div className='govuk-tabs' data-module={'govuk-tabs'}>
                    <ul className={'govuk-tabs__list'}>
                        {
                            this.props.caseTabs.map(tab => {
                                return (
                                    this.renderTabButton(tab.label, tab.type)
                                );
                            })
                        }
                    </ul>
                    {this.renderActiveTab()}
                </div>}
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired,
    caseTabs: PropTypes.array
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ page, activeTab, caseTabs, dispatch, summary }) =>
            <SideBar {...props} page={page} activeTab={activeTab} caseTabs={caseTabs} dispatch={dispatch} summary={summary}/>}
    </ApplicationConsumer>
);

export default WrappedSideBar;
