import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Document from './document.jsx';
import DocumentList from './document-list.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import { Link } from 'react-router-dom';
import DocumentPane from './document-pane.jsx';
import CaseNotes from './case-notes.jsx';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.activeTab || 'SUMMARY'
        };
    }

    setActive(e, tab) {
        e.preventDefault();
        this.setState({ active: tab });
    }

    isActive(tab) {
        return this.state.active === tab;
    }

    render() {
        const { page } = this.props;
        return (
            <Fragment>
                <div className='tabs'>
                    <ul>
                        <li><Link onClick={(e) => this.setActive(e, 'SUMMARY')} className={this.isActive('SUMMARY') ? 'tab tab__active' : 'tab'} to={`${page.url}/?activeTab=SUMMARY`}>Summary</Link></li>
                        <li><Link onClick={(e) => this.setActive(e, 'DOCUMENTS')} className={this.isActive('DOCUMENTS') ? 'tab tab__active' : 'tab'} to={`${page.url}/?activeTab=DOCUMENTS`}>Documents</Link></li>
                        <li><Link onClick={(e) => this.setActive(e, 'TIMELINE')} className={this.isActive('TIMELINE') ? 'tab tab__active' : 'tab'} to={`${page.url}/?activeTab=TIMELINE`}>Timeline</Link></li>
                    </ul>
                    {this.isActive('SUMMARY') && <div className='govuk-body'>PLACEHOLDER_SUMMARY</div>}
                    {this.isActive('DOCUMENTS') && <DocumentPane />}
                    {this.isActive('TIMELINE') && <CaseNotes />}
                </div>
            </Fragment>
        );
    }

}

SideBar.defaultProps = {
};

SideBar.propTypes = {
    page: PropTypes.object.isRequired
};

const WrappedSideBar = props => (
    <ApplicationConsumer>
        {({ dispatch, page, activeTab }) => <SideBar {...props} dispatch={dispatch} page={page} activeTab={activeTab} />}
    </ApplicationConsumer>
);

export default WrappedSideBar;