import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../common/forms/form.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import axios from 'axios';
import { redirect, updateForm, updateLocation } from '../contexts/actions/index.jsx';

class Stage extends Component {

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
            match: { url }
        } = this.props;
        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-l">
                        {form && <span className="govuk-caption-l">{form && form.meta && form.meta.caseReference}</span>}
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

Stage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object,
    match: PropTypes.func
};

const WrappedStage = props => (
    <ApplicationConsumer>
        {({ dispatch, form }) => <Stage {...props} dispatch={dispatch} form={form} />}
    </ApplicationConsumer>
);

export default WrappedStage;