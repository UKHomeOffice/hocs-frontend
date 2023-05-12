import React, { useContext, useEffect, Fragment, useState } from 'react';
import { Context } from '../../contexts/application.jsx';
import PropTypes from 'prop-types';
import status from '../../helpers/api-status';
import {
    updateApiStatus,
} from '../../contexts/actions';
import axios from 'axios';
import FormEmbeddedWrapped from '../forms/form-embedded-wrapped.jsx';

const TabOutOfContact = (props) => {
    const { dispatch, page } = useContext(Context);
    const [form, setForm] = useState(null);

    useEffect(() => {
        getForm();
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
                    action={`/api/case/${page.params.caseId}/stage/${page.params.stageId}/form/${props.screen}/allocate?type=OUT_OF_CONTACT`}
                    baseUrl={`/case/${page.params.caseId}/stage/${page.params.stageId}`}
                    history={props.history}
                />
            </Fragment>
            }
        </Fragment>
    );
};

TabOutOfContact.propTypes = {
    page: PropTypes.object,
    screen: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired
};

export default TabOutOfContact;
