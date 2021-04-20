import React, { Component, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCorrespondents,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const getExemptions = (page, setExemptions, dispatch) => {
    if (page && page.params && page.params.caseId) {
        // return dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL))
        //     .then(() => {
        //         axios.get(`/api/case/${page.params.caseId}/exemptions`)
        //             .then(response => {
        //                 console.log('data: ' + JSON.stringify(response.data));
        //                 dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_SUCCESS))
        //                     .then(() => dispatch(clearApiStatus()))
        //                     .then(() => {
        //                         this.setState({
        //                             correspondents: response.data
        //                         });
        //                     });
        //             });
        //     })
        //     .catch(() => {
        //         dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_FAILURE))
        //             .then(() => clearInterval(this.interval));
        //     });

        axios.get(`/api/case/${page.params.caseId}/exemptions`)
            .then(response => {
                setExemptions(response.data);
            });
    }
};

const renderExemption = (exemption) => {
    console.log(JSON.stringify(renderExemption));
    return (
        <Fragment key={exemption.uuid}>
            <h2 className='govuk-heading-m'>
                {exemption.type}
            </h2>
            <table className='govuk-table margin-left--small'>
                <tbody className='govuk-table__body'>
                    {exemption.type &&
                <tr className='govuk-table__row'>
                    <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Name</th>
                    <td className='govuk-table__cell'>{exemption.type}</td>
                </tr>
                    }
                    {exemption.created &&
                <tr className='govuk-table__row'>
                    <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Created</th>
                    <td className='govuk-table__cell'>{exemption.created}</td>
                </tr>
                    }
                </tbody>
            </table>
        </Fragment>
    );
};

const Exemptions = ({ page }) => {
    console.log('page: ' + JSON.stringify(page));

    const [exemptions, setExemptions] = useState([]);

    useEffect(() => {
        getExemptions(page, setExemptions);
    }, []);

    return (
        <Fragment>
            <Fragment>
                <div>Exemptions placeholder</div>
                <Fragment>
                    <Link className='govuk-body govuk-link'
                        to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/EXEMPTION/add`}>Add
                        Exemption</Link>
                    {exemptions && exemptions[0] !== null &&
                    exemptions.map(exemption => renderExemption(exemption))
                    }
                </Fragment>
            </Fragment>
        </Fragment>
    );
};


const WrappedExemptions = props => (
    <ApplicationConsumer>
        {({ dispatch, documents, page }) => <Exemptions {...props} dispatch={dispatch} documents={documents}
            page={page}/>}
    </ApplicationConsumer>
);

export default WrappedExemptions;
