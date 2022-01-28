/**
 *
 *
 * RDRDRDRD requires tests!
 */

import axios from 'axios';
import status from './api-status';
import { setError, updateApiStatus, updateCaseData } from '../contexts/actions/index.jsx';

module.exports = (caseId, dispatch) => {
    axios.get(`/api/case/${caseId}/`)
        .then(result => {
            dispatch(updateApiStatus(status.REQUEST_CASE_DATA_SUCCESS));
            dispatch(updateCaseData(result.data));
        }, error => {
            dispatch(updateApiStatus(status.REQUEST_CASE_DATA_FAILURE));
            dispatch(setError(error.response));
        });
};
