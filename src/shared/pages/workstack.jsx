import React, {Component} from "react";
import Form from "../common/forms/form.jsx";
import Forms from "../forms/index";

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
                        action={`/api/case/${Forms.caseType.submit}`}
                        fields={Forms.caseType.fields}
                        defaultActionLabel="Create"
                    />
                </div>
            </div>
        )
    }
}

export default WorkstackPage;