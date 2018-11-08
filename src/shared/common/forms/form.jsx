import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Submit from './submit.jsx';
import ErrorSummary from './error-summary.jsx';
import { formComponentFactory, secondaryActionFactory } from './form-repository.jsx';
import Ribbon from '../forms/ribbon.jsx';

class Form extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            action,
            children,
            data,
            errors,
            meta,
            method,
            page,
            schema
        } = this.props;
        return (
            <Fragment>
                {meta && meta.allocationNote &&
                    <Ribbon title={meta.allocationNote.type}>
                        <p>{meta.allocationNote.message}</p>
                    </Ribbon>
                }
                {errors && <ErrorSummary errors={errors} />}
                < form
                    action={action}
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
                                callback: this.props.updateFormState,
                                baseUrl: `/case/${page.caseId}/stage/${page.stageId}`
                            });
                        })
                    }
                    {schema.showPrimaryAction !== false && < Submit label={schema.defaultActionLabel} />}
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
    page: PropTypes.object.isRequired,
    children: PropTypes.node,
    secondaryActions: PropTypes.node,
    data: PropTypes.object,
    errors: PropTypes.object,
    method: PropTypes.string,
    schema: PropTypes.object.isRequired,
    submitHandler: PropTypes.func,
    updateFormState: PropTypes.func
};

Form.defaultProps = {
    defaultActionLabel: 'Submit',
    method: 'POST'
};

export default Form;