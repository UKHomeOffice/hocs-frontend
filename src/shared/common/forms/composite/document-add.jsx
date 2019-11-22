import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';
import { updateFormErrors } from '../../../contexts/actions/index.jsx';
class DocumentAdd extends Component {

    constructor() {
        super();
        this.state = { fileLimitError: undefined };
    }
    componentDidMount() {
        this.props.updateState({ [this.props.name]: null });
    }

    handleChange(e) {
        e.preventDefault();
        const { dispatch, name } = this.props;
        let { target: { files } } = e;
        files = Array.from(files);
        dispatch(updateFormErrors(undefined));
        const totalFileSize = files.map(file => file.size).reduce((sum, size) => sum + size, 0);
        if (totalFileSize > 1000000) {
            dispatch(updateFormErrors({ [name]: 'The total file size is too large.  Please upload files in smaller batches.' }));
            e.target.value = '';
            this.props.updateState({ [name]: undefined });
        } else {
            this.props.updateState({ [name]: files });
        }
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
    dispatch: PropTypes.func.isRequired,
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

const WrappedDocumentAdd = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <DocumentAdd {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

export default WrappedDocumentAdd;
