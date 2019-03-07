import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Submit from './submit.jsx';
import ErrorSummary from './error-summary.jsx';
import Ribbon from '../forms/ribbon.jsx';
import { formComponentFactory } from './form-repository.jsx';

const createTemplate = (factory, options) => ({ component, props }, key) => factory(component, { key, config: props, ...options });

const AllocationNote = ({ type, message }) => (
    <Ribbon title={type}>
        <p>{message}</p>
    </Ribbon>
);

AllocationNote.propTypes = {
    type: PropTypes.string,
    message: PropTypes.string
};

const Form = ({ schema, data, errors, meta, action, method = 'POST', submitHandler, showErrorSummary = true }) => {

    const createField = createTemplate(formComponentFactory, { data, errors, meta, callback: () => { }, baseUrl: '/' });

    return (
        <Fragment>
            {meta && meta.allocationNote && <AllocationNote {...meta.allocationNote} />}
            {showErrorSummary && errors && <ErrorSummary errors={errors} />}
            <form
                action={action}
                method={method}
                onSubmit={submitHandler}
                encType='multipart/form-data'
            >
                {schema && Array.isArray(schema.fields) && schema.fields.map(createField)}
                {schema.showPrimaryAction && <Submit label={schema.defaultActionLabel} />}
            </form>
        </Fragment>
    );

};

Form.propTypes = {
    action: PropTypes.string.isRequired,
    schema: PropTypes.object,
    errors: PropTypes.object,
    data: PropTypes.object,
    meta: PropTypes.object
};

export default Form;
