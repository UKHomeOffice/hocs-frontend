import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { clearApiStatus, updateApiStatus } from '../../contexts/actions/index.jsx';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import reducer from './standardLinesReducer';
import axios from 'axios';
import status from '../../helpers/api-status.js';
import Text from '../../common/forms/text.jsx';

const StandardLinesView = (props) => {

    const [state, reducerDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        loadStandardLines();
    }, []);

    const loadStandardLines = () =>  {
        const { dispatch } = props;

        dispatch(updateApiStatus(status.REQUEST_STANDARD_LINES_DATA))
            .then(() => {
                axios.get('/api/standard-lines')
                    .then(response => {
                        dispatch(updateApiStatus(status.REQUEST_STANDARD_LINES_DATA_SUCCESS))
                            .then(() => reducerDispatch({ type: 'PopulateStandardLines', payload: response.data }))
                            .then(() => dispatch(clearApiStatus()))
                            .catch(() => {
                                dispatch(updateApiStatus(status.REQUEST_STANDARD_LINES_DATA_FAILURE));
                            });
                    })
                    .catch(() => {
                        dispatch(updateApiStatus(status.REQUEST_STANDARD_LINES_DATA_FAILURE));
                    });
            });
    };

    const RenderFilter = () => {
        return (<div className="govuk-grid-row">
            <div className="govuk-grid-column-one-third">
                <div className="govuk-form-group filter-row">
                    <Text
                        label="Filter"
                        name="filter"
                        type="text"
                        updateState={(inputEvent) => reducerDispatch({ type: 'FilterStandardLines', payload: inputEvent.filter })}
                        value={state.filter}
                        autoFocus={true}
                    />
                    <span className="govuk-hint" aria-live="polite">
                        {`${state.activeStandardLines.length} Items`}
                    </span>
                </div>
                <div className="govuk-grid-row margin-bottom--small">
                    <div className="govuk-grid-column-two-thirds govuk-label--s padding-top--small">Exclude expired</div>
                    <div className="govuk-grid-column-one-third bigger">
                        <input
                            name="excludeExpired"
                            type="checkbox"
                            checked={state.excludeExpired}
                            onChange={event => reducerDispatch({ type: 'ExcludeExpiredCheckTrigger', payload: event.target.checked })}
                        />
                    </div>
                </div>
            </div>
        </div>);
    };

    const DisplayStandardLinesTable = () => {
        return (<Fragment>
            {state.activeStandardLines && RenderFilter()}
            {state.activeStandardLines && (
                <div className="scrollableTable">

                    < table className="govuk-table">
                        <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                <th className="govuk-table__header" scope="col">Topic</th>
                                <th className="govuk-table__header" scope="col">Team</th>
                                <th className="govuk-table__header" scope="col">Filename</th>
                                <th className="govuk-table__header" scope="col">Expiry date</th>
                                <th className="govuk-table__header" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="govuk-table__body">
                            {
                                state.activeStandardLines.map((standardLine) => {
                                    return (
                                        <tr className="govuk-table__row" key={standardLine.uuid}>
                                            <td className="govuk-table__cell">{standardLine.topic}</td>
                                            <td className="govuk-table__cell">{standardLine.team}</td>
                                            <td className="govuk-table__cell">{standardLine.displayName}</td>
                                            {RenderExpiryDateCell(standardLine)}
                                            <td className="govuk-table__cell govuk-!-width-one-quarter">
                                                <span>
                                                    <a href={`/api/standard-lines/download/${standardLine.documentUUID}`} className="govuk-link">Download</a>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
            }
        </Fragment >);
    };

    const RenderExpiryDateCell = (standardLine) => {
        if (standardLine.isExpired) {
            return <td className="govuk-table__cell date-warning"><span>{standardLine.expiryDate}</span></td>;
        }
        return <td className="govuk-table__cell date-standard"><span>{standardLine.expiryDate}</span></td>;
    };


    return (<div className="govuk-form-group">
        <div>
            <h1 className="govuk-heading-xl">View standard lines</h1>
            { state.activeStandardLines ?
                <div>
                    {DisplayStandardLinesTable()}
                </div> :
                <div>
                    <p className="govuk-body">Loading...</p>
                </div>
            }
            <br />
        </div>
    </div>);
};

const initialState = {
    allStandardLines: [],
    activeStandardLines: [],
    standardLinesLoaded: false,
    filter: '',
    excludeExpired: true
};

StandardLinesView.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

const WrappedStandardLines = (props) => (
    <ApplicationConsumer>
        {({ dispatch }) => (
            <StandardLinesView {...props} dispatch={dispatch} />
        )}
    </ApplicationConsumer>
);

export default WrappedStandardLines;
