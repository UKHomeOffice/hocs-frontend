import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class DocumentAdd extends Component {

    componentDidMount() {
        this.props.updateState({ [this.props.name]: null });
    }

    handleChange(e) {
        e.preventDefault();
        this.props.updateState({ [this.props.name]: Array.from(e.target.files) });
    }

    render() {
        const {
            allowMultiple,
            disabled,
            error,
            hint,
            label,
            name
        } = this.props;
        return (
            <Fragment>
                <div className={'govuk-form-group'}>
                    <label className="govuk-label" htmlFor={name} id={`${name}-label`}>


                        <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                        {hint && <span className="govuk-hint">{hint}</span>}
                        {error && <span id={`${name}-error`} className="govuk-error-message">{error}</span>}

                    </label>
                    <input
                        className="govuk-file-upload"
                        type={'file'}
                        id={name}
                        name={name}
                        onChange={e => this.handleChange(e)}
                        multiple={allowMultiple}
                        disabled={disabled}
                    />
                </div>
            </Fragment>
        );
    }
}

DocumentAdd.propTypes = {
    allowMultiple: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    value: PropTypes.string
};

DocumentAdd.defaultProps = {
    allowMultiple: false,
    disabled: false,
    label: 'Add document'
};

export default DocumentAdd;