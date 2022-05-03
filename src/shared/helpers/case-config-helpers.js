import axios from 'axios';
import status from './api-status';
import { setError, updateApiStatus, updateCaseConfig } from '../contexts/actions/index.jsx';

module.exports = (caseId, dispatch) => {
    axios.get(`/api/case/${caseId}/config`)
        .then(result => {
            dispatch(updateApiStatus(status.REQUEST_CASE_CONFIG_SUCCESS));
            dispatch(updateCaseConfig(result.data));
        }, error => {
            dispatch(updateApiStatus(status.REQUEST_CASE_CONFIG_FAILURE));
            dispatch(setError(error.response));
        });
};
