import React, {Component} from "react";
import {ApplicationConsumer} from "../contexts/application.jsx";
import {setPhase} from "../contexts/actions/index.jsx";

class TestPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            title
        } = this.props;
        return (
            <ApplicationConsumer>
                {({dispatch}) => {
                    return (
                        <div className="grid-row">
                            <div className="column-full">
                                {title} Test Page
                                <button onClick={e => dispatch(setPhase('TEST'))}>
                                    Click Me
                                </button>
                            </div>
                        </div>
                    );
                }}
            </ApplicationConsumer>
        )
    }
}

export default TestPage;