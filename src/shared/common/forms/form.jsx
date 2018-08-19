import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Submit from './submit.jsx';
import ErrorSummary from './error-summary.jsx';
import { formComponentFactory, secondaryActionFactory } from './form-repository.jsx';

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props.data };
    }

    render() {
        const {
            action,
            children,
            data,
            errors,
            method,
            schema
        } = this.props;
        return (
            <Fragment>
                {errors && <ErrorSummary errors={errors} />}
                < form
                    action={action + '?noScript=true'}
                    method={method}
                    onSubmit={this.props.submitHandler}
                    encType="multipart/form-data"
                >
                    {children}
                    {
                        schema && schema.fields && schema.fields.map((field, key) => {
                            return formComponentFactory(field.component, {
                                key,
                                config: field.props,
                                data,
                                errors,
                                callback: this.props.updateFormState
                            });
                        })
                    }
                    < Submit label={schema.defaultActionLabel} />
                    {
                        schema && schema.secondaryActions && schema.secondaryActions.map((field, key) => {
                            return secondaryActionFactory(field.component, {
                                key,
                                config: field.props,
                                data,
                                errors,
                                callback: this.props.updateFormState
                            });
                        })
                    }
                </form >
            </Fragment >
        );
    }
}

Form.propTypes = {
    action: PropTypes.string,
    children: PropTypes.node,
    secondaryActions: PropTypes.node,
    data: PropTypes.object,
    errors: PropTypes.object,
    method: PropTypes.string,
    schema: PropTypes.object.isRequired,
    submitHandler: PropTypes.func.isRequired,
    updateFormState: PropTypes.func.isRequired
};

Form.defaultProps = {
    defaultActionLabel: 'Submit',
    method: 'POST'
};

export default Form;