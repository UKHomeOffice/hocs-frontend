import axios from 'axios';
import status from './api-status';
import { setError, updateApiStatus, updateCaseSummary } from '../contexts/actions/index.jsx';

module.exports = (caseId, dispatch) => {
    axios.get(`/api/case/${caseId}/summary`)
        .then(result => {
            dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY_SUCCESS));
            dispatch(updateCaseSummary(result.data));
        }, error => {
            dispatch(updateApiStatus(status.REQUEST_CASE_SUMMARY_FAILURE));
            dispatch(setError(error.response));
        });
};
