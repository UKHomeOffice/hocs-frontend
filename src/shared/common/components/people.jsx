import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { clearApiStatus, unsetCorrespondents, updateApiStatus } from '../../contexts/actions/index.jsx';
import status from '../../helpers/api-status.js';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
                    {this.getTitle(person)}
                </h2>
                <table className='govuk-table margin-left--small'>
                    <tbody className='govuk-table__body'>
                        {person.fullname &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Name</th>
                            <td className='govuk-table__cell'>{person.fullname}</td>
                        </tr>
                        }
                        {person.organisation &&
                        <tr className='govuk-table__row'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Organisation</th>
                            <td className='govuk-table__cell'>{person.organisation}</td>
                        </tr>
                        }
                        {(person.address.address1 || person.address.address2 || person.address.address3
                                || person.address.postcode || person.address.country ) &&
                        <tr className='govuk-table__cell'>
                            <th className='govuk-table__header padding-left--small govuk-!-width-one-third'>Address</th>
                            <td className='govuk-table__cell'>
                                {person.address.address1 && <> <span>{person.address.address1} </span> <br/></>}
                                {person.address.address2 && <> <span>{person.address.address2} </span> <br/></>}
                                {person.address.address3 && <> <span>{person.address.address3} </span> <br/></>}
                                {person.address.postcode && <> <span>{person.address.postcode} </span> <br/> </>}
                                {person.address.country && <>  <span>{person.address.country} </span> </>}
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
                <Link className='govuk-body govuk-link'
                    to={`/case/${page.params.caseId}/stage/${page.params.stageId}/entity/people/manage`}>Manage
                    People</Link>
                {correspondents && correspondents[0] !== null &&
                correspondents.map(person => this.renderPerson(person))
                }
            </Fragment>
        );
    }

    getTitle({ type, typeDisplayName, isPrimary }) {
        let title;

        if (typeDisplayName) {
            title = typeDisplayName;
        } else {
            title = type.replace(/\w\S*/g,
                (txt) => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
        }

        return title + (isPrimary ? ' (primary)' : '');
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
