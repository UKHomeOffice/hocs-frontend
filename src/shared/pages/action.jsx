import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/forms/form.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import axios from 'axios';
import { redirect, updateForm, updateLocation } from '../contexts/actions/index.jsx';

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
        const { form } = this.props;
        if (!form) {
            axios.get(url)
                .then(res => {
                    this.props.dispatch(updateForm(res.data));
                })
                .catch(err => {
                    if (err.response.status === 403) {
                        return this.props.dispatch(redirect('/unauthorised'));
                    }
                    return this.props.dispatch(redirect('/error'));
                });
        }
    }

    render() {
        const {
            caseRef,
            form,
            match: { url },
            subTitle
        } = this.props;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-large">
                        {caseRef}
                        {form && form.schema && form.schema.title}
                        {subTitle && <span className="heading-secondary">{subTitle}</span>}
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
    caseRef: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object,
    match: PropTypes.object,
    subTitle: PropTypes.string
};

const WrappedPage = props => (
    <ApplicationConsumer>
        {({ dispatch, form }) => <Action {...props} dispatch={dispatch} form={form} />}
    </ApplicationConsumer>
);

export default WrappedPage;