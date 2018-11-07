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

class CaseNotes extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className='govuk-grid-row'>
                    <div className='govuk-grid-column-full'>
                        <div className='timeline'>
                            <ul>
                                <li className='recent-action'>
                                    <h2>Data Input</h2>
                                    <p className='time'>2 September 2018 at 1.26pm</p>
                                    <p>Allocated to Skeletor</p>
                                    <p className='time'>2 September 2018 at 1.01pm</p>
                                    <p>Allocated to Bob Ross</p>
                                </li>
                                <li>
                                    <h2>Reject</h2>
                                    <p className='time'>1 September 2018 at 4.35pm</p>
                                    <p>He-Man: "I have the power!"</p>
                                </li>
                                <li>
                                    <h2>Markup</h2>
                                    <p className='time'>1 September 2018 at 2.09pm</p>
                                    <p>Allocated to He-Man</p>
                                    <p className='time'>1 September 2018 at 1.21pm</p>
                                    <p>Bob Ross: "You just sort of have to make almighty decisions. Just leave that space open. Let's start with an almighty sky here."</p>
                                </li>
                                <li>
                                    <h2>Data Input</h2>
                                    <p className='time'>19 August 2018 at 1.01pm</p>
                                    <p>Allocated to Bob Ross</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

}

CaseNotes.defaultProps = {
};

CaseNotes.propTypes = {
};

const WrappedCaseNotes = props => (
    <ApplicationConsumer>
        {({ dispatch, documents, page }) => <CaseNotes {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default WrappedCaseNotes;