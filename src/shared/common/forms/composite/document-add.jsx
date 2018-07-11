import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../../contexts/application.jsx';

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
            error,
            hint,
            label,
            name
        } = this.props;
        return (
            <Fragment>
                <label htmlFor={name} id={`${name}-label`}>

                    <span className="form-label-bold">{label}</span>
                    {hint && <span className="form-hint">{hint}</span>}
                    {error && <span className="error-message">{error}</span>}

                </label>
                <input
                    className="button-file-upload"
                    type={'file'}
                    id={name}
                    name={name}
                    onChange={e => this.handleChange(e)}
                    multiple={allowMultiple}
                />
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

const WrappedButton = props => (
    <ApplicationConsumer>
        {() => <DocumentAdd {...props} />}
    </ApplicationConsumer>
);

export default WrappedButton;