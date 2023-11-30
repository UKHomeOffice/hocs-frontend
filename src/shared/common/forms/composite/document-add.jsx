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
        const { dispatch, maxUploadSize, name, updateState } = this.props;
        let { target: { files } } = e;
        files = Array.from(files);
        dispatch(updateFormErrors(undefined));
        const totalFileSize = files.map(file => file.size).reduce((sum, size) => sum + size, 0);
        if (totalFileSize > maxUploadSize) {
            dispatch(updateFormErrors({ [name]: 'The total file size is too large.  If you are uploading multiple files. Please try smaller batches.' }));
            e.target.value = '';
            updateState({ [name]: undefined });
        } else {
            updateState({ [name]: files });
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
                    <label htmlFor={name} id={`${name}-label`} className="govuk-label govuk-label--s">{label}</label>
                    {hint && <div className="govuk-hint">{hint}</div>}
                    {error && <p id={`${name}-error`} className="govuk-error-message">{error}</p>}
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
    maxUploadSize: PropTypes.number.isRequired,
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
        {({ dispatch, layout: { maxUploadSize } = { maxUploadSize: 10 } }) => <DocumentAdd {...props} dispatch={dispatch} maxUploadSize={maxUploadSize} />}
    </ApplicationConsumer>
);

export default WrappedDocumentAdd;
