import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from '../forms/form.jsx';
import { ApplicationConsumer, Context } from '../../contexts/application.jsx';

/**
 * Embedded form with a wrapped state, designed to be embedded outside of workflows or pages.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormEmbeddedWrapped = (props) => {
    const [formState, setFormState] = useState( { ...props.fieldData, submittingForm: false });
    const { dispatch } = React.useContext(Context);

    const setWrappedState = (data) => {
        setFormState((state) => (
            { ...state, ...data }
        ));
    };

    return <Form
        page={props.page}
        schema={props.schema}
        updateFormState={setWrappedState}
        data={formState}
        action={props.action}
        baseUrl={props.baseUrl}
        submitHandler={props.submitHandler(formState, setWrappedState, dispatch)}
        submittingForm={formState.submittingForm}
    />;
};

FormEmbeddedWrapped.propTypes = {
    page: PropTypes.object,
    schema: PropTypes.object,
    dispatch: PropTypes.func,
    fieldData: PropTypes.object,
    submitHandler: PropTypes.func,
    action: PropTypes.string,
    baseUrl: PropTypes.string
};

const FormEmbeddedWrappedWrapper = props => (
    <ApplicationConsumer>
        {({ dispatch, page }) => <FormEmbeddedWrapped {...props} dispatch={dispatch} page={page} />}
    </ApplicationConsumer>
);

export default FormEmbeddedWrappedWrapper;
