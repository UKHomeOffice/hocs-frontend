import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';
import People from './people.jsx';
import CaseActions from './case-actions.jsx';
import TabExGratia from './tab-ex-gratia.jsx';
import updateCaseConfig from '../../helpers/case-config-helpers';

class SideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: props.activeTab || 'DOCUMENTS'
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
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.page.params !== this.props.page.params) {
            this.updateTabs();
        }
    }

    setActive(e, tab) {
        e.preventDefault();
        if (tab !== this.state.active) {
            this.props.track('EVENT', { category: 'Side bar', action: 'Select tab', label: tab });
        }
        this.setState({ active: tab });
    }

    isActive(tab) {
        return this.state.active === tab;
    }

    renderTabButton(label, value) {
        const { page } = this.props;
        return (
            <li>
                <Link onClick={(e) => this.setActive(e, value)} className={this.isActive(value) ? 'tab tab__active' : 'tab'} to={`${page.url}/?activeTab=${value}`}>
                    {label}
                </Link>
            </li>
        );
    }

    updateTabs() {
        const { page, dispatch } = this.props;
        if (page && page.params && page.params.caseId) {
            updateCaseConfig(page.params.caseId, dispatch);
        }
    }

    render() {
        const caseTabs = this.props.caseConfig ? this.props.caseConfig.tabs : ['documents'];
        return (
            <Fragment>
                <div className='tabs'>
                    <ul>
                        {caseTabs.includes('documents') && this.renderTabButton('Documents', 'DOCUMENTS')}
                        {caseTabs.includes('summary') && this.renderTabButton('Summary', 'SUMMARY')}
                        {caseTabs.includes('timeline') && this.renderTabButton('Timeline', 'TIMELINE')}
                        {caseTabs.includes('people') && this.renderTabButton('People', 'PEOPLE')}
                        {caseTabs.includes('actions') && this.renderTabButton('Actions', 'FOI_ACTIONS')}
                        {caseTabs.includes('ex_gratia') && this.renderTabButton('Ex-Gratia', 'EX_GRATIA')}
                    </ul>
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('SUMMARY') && <StageSummary />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                    {this.isActive('PEOPLE') && <People />}
                    {this.isActive('FOI_ACTIONS') && <CaseActions />}
                    {this.isActive('EX_GRATIA') && <TabExGratia stages={this.props.summary.stages} />}
                </div>
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    summary: PropTypes.object.isRequired,
    caseConfig: PropTypes.object
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ track, page, activeTab, caseConfig, dispatch, summary }) =>
            <SideBar {...props} track={track} page={page} activeTab={activeTab} caseConfig={caseConfig} dispatch={dispatch} summary={summary}/>}
    </ApplicationConsumer>
);

export default WrappedSideBar;
