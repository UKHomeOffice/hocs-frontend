import axios from 'axios';
import { setError, updateCaseTabs } from '../contexts/actions/index.jsx';

module.exports = (caseId, dispatch) => {
    axios.get(`/api/case/${caseId}/tabs`)
        .then(result => {
            dispatch(updateCaseTabs(result.data));
        }, error => {
            dispatch(setError(error.response));
        });
};
