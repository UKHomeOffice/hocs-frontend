import React, {Component} from "react";
import Form from "../common/forms/form.jsx";
import {ApplicationConsumer} from "../contexts/application.jsx";
import axios from "axios";
import {redirect, updateForm, updateLocation} from "../contexts/actions/index.jsx";

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
        const {form} = this.props;
        if (!form) {
            axios.get(url)
                .then(res => {
                    this.props.dispatch(updateForm(res.data));
                })
                .catch(err => {
                    console.error(err.response.status);
                    if (err.response.status === 403) {
                        return this.props.dispatch(redirect('/unauthorised'));
                    }
                    return this.props.dispatch(redirect('/error'));
                });
        }
    }

    render() {
        const {
            form,
            match: {url, params: {caseId, stageId}}
        } = this.props;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-large">
                        {form && form.schema && form.schema.title}
                        <span className="heading-secondary">{`${form && form.meta && form.meta.caseRef}`}</span>
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

const
    WrappedStage = props => (
        <ApplicationConsumer>
            {({dispatch, form}) => <Stage {...props} dispatch={dispatch} form={form}/>}
        </ApplicationConsumer>
    );

export default WrappedStage;