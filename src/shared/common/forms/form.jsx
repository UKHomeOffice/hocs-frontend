import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Submit from './submit.jsx';
import ErrorSummary from './error-summary.jsx';
import { formComponentFactory, secondaryActionFactory } from './form-repository.jsx';
import Ribbon from '../forms/ribbon.jsx';

class Form extends Component {

    constructor(props) {
        super(props);
    }

    renderForm(form = this.getFormGroup()) {
        const {
            schema: { props }
        } = this.props;

        if (props?.collapsable) {
            return (<details className='govuk-details'>
                <summary className='govuk-details__summary margin-bottom--small'>
                    <span className='govuk-details__summary-text'>
                        { props.collapsable.hintText || 'Expand' }
                    </span>
                </summary>
                {form}
            </details>);
        }

        return form;
    }

    getFormGroup() {
        const {
            action,
            children,
            data,
            errors,
            meta,
            method,
            page,
            schema,
            submittingForm,
            switchDirection
        } = this.props;

        return (
            <form
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
                            baseUrl: this.props.baseUrl,
                            page,
                            caseRef: meta ? meta.caseReference : undefined,
                            switchDirection
                        });
                    })
                }
                {schema.showPrimaryAction !== false && <Submit label={schema.defaultActionLabel} disabled={submittingForm} />}
                {
                    schema && schema.secondaryActions && schema.secondaryActions.map((field, key) => {
                        return secondaryActionFactory(field.component, {
                            key,
                            config: field.props,
                            data,
                            errors,
                            callback: this.props.updateFormState,
                            page,
                            switchDirection
                        });
                    })
                }
            </form>);
    }

    render() {
        const {
            errors,
            meta
        } = this.props;

        return (
            <>
                {meta && meta.allocationNote &&
                    <Ribbon title={meta.allocationNote.type}>
                        <p>{meta.allocationNote.message}</p>
                    </Ribbon>
                }
                {errors && <ErrorSummary errors={errors} />}
                { this.renderForm() }
            </>
        );
    }
}

Form.propTypes = {
    action: PropTypes.string,
    page: PropTypes.object.isRequired,
    children: PropTypes.node,
    secondaryActions: PropTypes.node,
    data: PropTypes.object,
    meta: PropTypes.object,
    errors: PropTypes.object,
    method: PropTypes.string,
    schema: PropTypes.object.isRequired,
    submitHandler: PropTypes.func,
    updateFormState: PropTypes.func,
    switchDirection: PropTypes.func,
    submittingForm: PropTypes.bool.isRequired,
    baseUrl: PropTypes.string.isRequired
};

Form.defaultProps = {
    defaultActionLabel: 'Submit',
    method: 'POST',
    submittingForm: false
};

export default Form;
