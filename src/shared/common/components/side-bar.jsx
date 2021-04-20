import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';
import People from './people.jsx';
import Exemptions from './exemptions.jsx';

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
        let exemptionsTabEnabled = false;

        const { page, caseType } = this.props;

        console.log(`caseType: ${JSON.stringify(caseType)}`);

        if (caseType && page) {
            // this check disables the people tab for WCS cases
            if(caseType === 'WCS' || caseType === 'FOI') {
                peopleTabEnabled = false;
            }

            if (caseType === 'FOI') {
                exemptionsTabEnabled = true;
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
                        {exemptionsTabEnabled && this.renderTabButton('Exemptions', 'EXEMPTIONS')}
                    </ul>
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('SUMMARY') && <StageSummary />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                    {this.isActive('PEOPLE') && <People />}
                    {this.isActive('EXEMPTIONS') && <Exemptions />}
                </div>
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired,
    caseType: PropTypes.string
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ track, page, activeTab, caseType }) => <SideBar {...props} track={track} page={page} activeTab={activeTab} caseType={caseType}/>}
    </ApplicationConsumer>
);

export default WrappedSideBar;