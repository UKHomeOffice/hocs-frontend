import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';
import People from './people.jsx';
import FoiActions from './foi-actions.jsx';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.activeTab || 'DOCUMENTS'
        };
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

    render() {
        let peopleTabEnabled = true;
        let foiActionstabEnabled = false;
        const { summary: { type } = {} } = this.props;

        if (type) {
            // this check disables the people tab for WCS cases
            if(type === 'WCS' || type === 'FOI') {
                peopleTabEnabled = false;
            }

            if (type === 'FOI') {
                foiActionstabEnabled = true;
            }
        }

        return (
            <Fragment >
                <div className='tabs'>
                    <ul>
                        {this.renderTabButton('Documents', 'DOCUMENTS')}
                        {this.renderTabButton('Summary', 'SUMMARY')}
                        {this.renderTabButton('Timeline', 'TIMELINE')}
                        {peopleTabEnabled && this.renderTabButton('People', 'PEOPLE')}
                        {foiActionstabEnabled && this.renderTabButton('Actions', 'FOI_ACTIONS')}
                    </ul>
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('SUMMARY') && <StageSummary />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                    {this.isActive('PEOPLE') && <People />}
                    {this.isActive('FOI_ACTIONS') && <FoiActions />}
                </div>
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    summary: PropTypes.object.isRequired,
    test: PropTypes.string.isRequired
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ track, page, activeTab, summary }) =>
            <SideBar {...props} track={track} page={page} activeTab={activeTab} summary={summary} test={'test'}/>}
    </ApplicationConsumer>
);

export default WrappedSideBar;