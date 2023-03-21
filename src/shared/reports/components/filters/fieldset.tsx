import React, { FieldsetHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export interface FieldsetProps extends PropsWithChildren<FieldsetHTMLAttributes<HTMLFieldSetElement>> {
    legend: string
    id: string
    hint?: string
    error?: string
    children?: ReactNode
}

export const Fieldset = ({ legend, id, hint, error, children, ...props }: FieldsetProps) =>
    <fieldset
        className='govuk-fieldset'
        role='group'
        aria-describedby={[
            ...(hint ? [`${id}--hint`] : []),
            ...(error ? [`${id}--error`] : []),
        ].join(' ')}
        {...props}
    >
        <legend className='govuk-fieldset__legend govuk-fieldset__legend--m'>
            <h3 className='govuk-fieldset__heading'>{legend}</h3>
        </legend>
        {hint && <p id={`${id}--hint`} className='govuk-hint'>{hint}</p>}
        {error && <p id={`${id}--error`} className='govuk-error-message'>
            <span className="govuk-visually-hidden">Error:</span>{' '}
            {error}
        </p>}
        {children}
    </fieldset>;
