import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import status from '../../helpers/api-status';
import {
    updateApiStatus,
    unsetCaseData,
} from '../../contexts/actions/index.jsx';
import axios from 'axios';
import FormEmbeddedWrapped from '../forms/form-embedded-wrapped.jsx';

const TabExGratia = (props) => {
    const { dispatch, page } = useContext(Context);
    const [form, setForm] = useState(null);

    useEffect(() => {
        getForm();
        return function cleanup() {
            dispatch(unsetCaseData());
        };
    }, []);

    const getForm = () => {
        const { screen } = props;

        dispatch(updateApiStatus(status.REQUEST_FORM))
            .then(() => axios.get(`/api/form/${screen}/case/${page.params.caseId}`))
            .then(({ data }) => setForm(data))
            .then(() => dispatch(updateApiStatus(status.REQUEST_FORM_SUCCESS)));
    };

    return (
        <Fragment>
            {form &&
            <Fragment>
                <h2 className='govuk-heading-m'>{form.schema.title}</h2>
                <FormEmbeddedWrapped
                    schema={ form.schema }
                    fieldData={ form.data }
                    action={`/api/case/${page.params.caseId}/stage/${page.params.stageId}/form/${props.screen}/data?type=EX_GRATIA_UPDATE`}
                    baseUrl={`/case/${page.params.caseId}/stage/${page.params.stageId}`}
                />
            </Fragment>
            }
        </Fragment>
    );
};

TabExGratia.propTypes = {
    page: PropTypes.object,
    screen: PropTypes.string.isRequired
};

export default TabExGratia;
