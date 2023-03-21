import React, { FieldsetHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export interface FormGroupProps extends PropsWithChildren<FieldsetHTMLAttributes<HTMLDivElement>> {
    label: string
    id: string
    hint?: string
    error?: string
    children?: ReactNode
}

export const FormGroup = ({ label, id, hint, error, children, ...props }: FormGroupProps) =>
    <div
        className={`govuk-form-group${error ? ' govuk-form-group__error' : ''}`}
        {...props}
    >
        <label htmlFor={id} className='govuk-label govuk-label--s'>
            <h3 className='govuk-label-wrapper'>{label}</h3>
        </label>
        {hint && <p id={`${id}--hint`} className='govuk-hint'>{hint}</p>}
        {error && <p id={`${id}--error`} className='govuk-error-message'>
            <span className="govuk-visually-hidden">Error:</span>{' '}
            {error}
        </p>}
        {children}
    </div>;
