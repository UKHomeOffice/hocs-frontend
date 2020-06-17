import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import {
    updateApiStatus,
    unsetCorrespondents,
    clearApiStatus
} from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

class People extends Component {

    constructor(props) {
        super(props);
        this.state = { correspondents: props.correspondents };
    }

    componentDidMount() {
        const { correspondents, dispatch } = this.props;
        if (!correspondents) {
            this.getCorrespondents();
        }
        dispatch(unsetCorrespondents());
    }

    getCorrespondents() {
        const { page, dispatch } = this.props;
        if (page && page.params && page.params.caseId) {
            return dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL))
                .then(() => {
                    axios.get(`/api/case/${page.params.caseId}/correspondents`)
                        .then(response => {
                            dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_SUCCESS))
                                .then(() => dispatch(clearApiStatus()))
                                .then(() => {
                                    this.setState({
                                        correspondents: response.data
                                    });
                                });
                        });
                })
                .catch(() => {
                    dispatch(updateApiStatus(status.REQUEST_CASE_CORRESPONDENTS_ALL_FAILURE))
                        .then(() => clearInterval(this.interval));
                });
        }
    }

    renderPerson(person) {
        return (
            <Fragment key={person.uuid}>
                <h2 className='govuk-heading-m'>
                    {this.toTitleCase(person.type) + (person.isPrimary ? ' (primary)' : '')}
                </h2>
                <table className='govuk-table margin-left--small'>
                    <tbody className='govuk-table__body'>
                        {person.fullname &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Name</th>
                            <td className='govuk-table__cell'>{person.fullname}</td>
                        </tr>
                        }
                        {person.address.address1 &&
                        <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Address</th>
                            <td className='govuk-table__cell'>
                                {person.address.address1 && <> <span>{person.address.address1}</span> </>}
                                {person.address.address2 && <> <br/> <span>{person.address.address2}</span> </>}
                                {person.address.address3 && <> <br/> <span>{person.address.address3}</span> </>}
                                {person.address.postcode && <> <br/> <span>{person.address.postcode}</span> </>}
                                {person.address.country && <> <br/> <span>{person.address.country}</span> </>}
                            </td>
                        </tr>
                        }
                        {person.telephone &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Telephone</th>
                            <td className='govuk-table__cell'>{person.telephone}</td>
                        </tr>
                        }
                        {person.email &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Email
                                address
                            </th>
                            <td className='govuk-table__cell'>{person.email}</td>
                        </tr>
                        }
                        {person.reference &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Reference</th>
                            <td className='govuk-table__cell'>{person.reference}</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </Fragment>
        );
    }

    render() {
        const { correspondents } = this.state;
        const { page } = this.props;
        return (
            <Fragment>
                <BrowserRouter className='govuk-body govuk-link' to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/people/manage`} >Manage People</BrowserRouter>
                {correspondents &&  correspondents[0] !== null &&
                correspondents.map(person => this.renderPerson(person))
                }
            </Fragment>
        );
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
}

People.propTypes = {
    dispatch: PropTypes.func.isRequired,
    correspondents: PropTypes.array,
    page: PropTypes.object
};

const WrappedPeople = props => (
    <ApplicationConsumer>
        {({ dispatch, correspondents, page }) => <People {...props} dispatch={dispatch} correspondents={correspondents}
            page={page}/>}
    </ApplicationConsumer>
);

export default WrappedPeople;
