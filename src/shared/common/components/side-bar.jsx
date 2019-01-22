import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';
import StageSummary from './stage-summary.jsx';

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
        return (
            <Fragment>
                <div className='tabs'>
                    <ul>
                        {this.renderTabButton('Documents', 'DOCUMENTS')}
                        {this.renderTabButton('Summary', 'SUMMARY')}
                        {this.renderTabButton('Timeline', 'TIMELINE')}
                    </ul>
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('SUMMARY') && <StageSummary />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                </div>
            </Fragment>
        );
    }

}

SideBar.propTypes = {
    activeTab: PropTypes.string,
    page: PropTypes.object.isRequired,
    track: PropTypes.func.isRequired

};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ track, page, activeTab }) => <SideBar {...props} track={track} page={page} activeTab={activeTab} />}
    </ApplicationConsumer>
);

export default WrappedSideBar;