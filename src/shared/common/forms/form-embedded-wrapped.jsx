import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../forms/form.jsx';

/**
 * Embedded form with a wrapped state, designed to be embedded outside of workflows or pages.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormEmbeddedWrapped = (props) => {
    const [formState, setFormState] = useState({});

    const setWrappedState = (data) => {
        setFormState((state) => (
            { ...state, ...data }
        ));
    };

    return <Form page={props.page} schema={props.schema} updateFormState={setWrappedState} data={formState} />;
};

FormEmbeddedWrapped.propTypes = {
    page: PropTypes.object,
    schema: PropTypes.object
};

export default FormEmbeddedWrapped;
