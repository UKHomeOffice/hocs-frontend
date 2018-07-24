import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/forms/form.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import axios from 'axios';
import { updateForm, updateLocation, setError } from '../contexts/actions/index.jsx';

class Action extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(updateLocation(this.props.match));
        this.getForm();
    }

    getForm() {
        const url = '/forms' + this.props.match.url;
        axios.get(url)
            .then(res => {
                this.props.dispatch(updateForm(res.data));
            })
            .catch(err => {
                return this.props.dispatch(setError(err.response.data));
            });
    }

    render() {
        const {
            form,
            match: { url },
            caption
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-l">
                        {caption && <span className="govuk-caption-l">{caption}</span>}
                        {form && form.schema && form.schema.title}

                    </h1>
                    {form && form.schema && <Form
                        action={url}
                        schema={form.schema}
                        data={form.data}
                        errors={form.errors}
                        getForm={() => this.getForm()}
                    />}
                </div>
            </div>
        );
    }
}

Action.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object,
    match: PropTypes.object,
    caption: PropTypes.string,
    history: PropTypes.object.isRequired
};

const WrappedPage = props => (
    <ApplicationConsumer>
        {({ dispatch, form }) => <Action {...props} dispatch={dispatch} form={form} />}
    </ApplicationConsumer>
);

export default WrappedPage;