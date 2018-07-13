import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/forms/form.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import axios from 'axios';
import { redirect, updateForm, updateLocation } from '../contexts/actions/index.jsx';

class Case extends Component {

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
                if (err.response.status === 403) {
                    return this.props.dispatch(redirect('/unauthorised'));
                }
                return this.props.dispatch(redirect('/error'));
            });
    }

    render() {
        const {
            form,
            match: { url, params: { caseId } }
        } = this.props;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-large">
                        {form && form.schema && form.schema.title}
                        <span className="heading-secondary">{`${caseId}`}</span>
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

Case.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object,
    match: PropTypes.object
};

const WrappedPage = props => (
    <ApplicationConsumer>
        {({ dispatch, form }) => <Case {...props} dispatch={dispatch} form={form} />}
    </ApplicationConsumer>
);

export default WrappedPage;