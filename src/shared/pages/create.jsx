import React, {Component} from "react";
import Form from "../common/forms/form.jsx";
import Forms from "../forms/index";

class WorkstackPage extends Component {
    render() {
        const {
            title
        } = this.props;
        const caseId = this.props.match.params.caseId;
        return (
            <div className="grid-row">
                <div className="column-full">
                    <h1 className="heading-xlarge">
                        {title}
                        <span className="heading-secondary">{`${caseId}`}</span>
                    </h1>
                    <Form
                        action={`/api/case/${Forms.create.submit}`}
                        fields={Forms.create.fields}
                        defaultActionLabel="Next"
                    />
                </div>
            </div>
        )
    }
}

export default WorkstackPage;