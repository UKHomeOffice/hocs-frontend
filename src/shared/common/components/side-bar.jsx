import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';
import People from './people.jsx';
import CaseActions from './case-actions.jsx';
import getTabsByShortCode from '../../helpers/case-type-sidebar-tabs-flags';

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

    resolveTabsForCaseTypeByShortCode(type) {
        return getTabsByShortCode(type);
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

    render() {
        const { type } = this.props.summary;
        const caseTabs = this.resolveTabsForCaseTypeByShortCode(type);
        return (
            <Fragment >
                <div className='tabs'>
                    <ul>
                        {this.renderTabButton('Documents', 'DOCUMENTS')}
                        {this.renderTabButton('Summary', 'SUMMARY')}
                        {this.renderTabButton('Timeline', 'TIMELINE')}
                        {caseTabs.people && this.renderTabButton('People', 'PEOPLE')}
                        {caseTabs.foi_actions && this.renderTabButton('Actions', 'FOI_ACTIONS')}
                    </ul>
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('SUMMARY') && <StageSummary />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                    {this.isActive('PEOPLE') && <People />}
                    {this.isActive('FOI_ACTIONS') && <CaseActions />}
                </div>
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    summary: PropTypes.object.isRequired
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ track, page, activeTab, summary }) =>
            <SideBar {...props} track={track} page={page} activeTab={activeTab} summary={summary}/>}
    </ApplicationConsumer>
);

export default WrappedSideBar;