import React, {Component} from "react";
import Form from "../common/forms/form.jsx";
import {ApplicationConsumer} from "../contexts/application.jsx";
import axios from "axios";
import {updateForm, updateLocation, redirect} from "../contexts/actions/index.jsx";

class Case extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(updateLocation(this.props.match));
        this.getForm();
    }

    getForm() {
        const url = '/api' + this.props.match.url + '/SomeId';
        axios.get(url)
            .then(res => {
                console.log('FORM RECEIVED');
                this.props.dispatch(updateForm(res.data));
            })
            .catch(err => {
                console.error(err);
                this.props.dispatch(redirect('/error'));
            });
    }

    render() {
        const {
            title,
            form,
            match: {url, params}
        } = this.props;
        const caseId = params.caseId;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-xlarge">
                        {title}
                        <span className="heading-secondary">{`${caseId}`}</span>
                    </h1>
                    <Form
                        action={url + '/someCaseId'}
                        fields={form.fields}
                    />
                </div>
            </div>
        )
    }
}

const WrappedPage = props => (
    <ApplicationConsumer>
        {({dispatch, form}) => <Case {...props} dispatch={dispatch} form={form}/>}
    </ApplicationConsumer>
);

export default WrappedPage;