import React, {Component} from "react";

class WorkstackPage extends Component {
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
                </div>
            </div>
        )
    }
}

export default WorkstackPage;