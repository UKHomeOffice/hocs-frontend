import axios from 'axios';
import status from './api-status';
import { setError, updateApiStatus, updateCaseSummary } from '../contexts/actions/index.jsx';

export function updateSummary(caseId, dispatch) {
    return axios.get(`/api/case/${caseId}/summary`
    ).then(result => {
        dispatch(updateCaseSummary(result.data));
    }).catch(error => {
        dispatch(updateApiStatus(status.SUBMIT_FORM_FAILURE))
            .then(() => dispatch(setError(error.response)));
    });
}
