import React, {Component} from "react";
import Form from "../common/forms/form.jsx";
import formConfiguration from "../forms/case-type.json";

class WorkstackPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            title,
            subTitle
        } = this.props;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-xlarge">
                        {title}
                        {subTitle && <span className="heading-secondary">{subTitle}</span>}
                    </h1>
                    <Form
                        action="/api/case/create"
                        fields={formConfiguration}
                        defaultActionLabel="Create"
                    />
                </div>
            </div>
        )
    }
}

export default WorkstackPage;