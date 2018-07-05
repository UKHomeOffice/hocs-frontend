import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ApplicationConsumer} from "../contexts/application.jsx";
import {updateLocation} from "../contexts/actions/index.jsx";

class MainPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(updateLocation(this.props.match));
    }

    render() {
        const {
            title,
            subTitle
        } = this.props;
        return (
            <ApplicationConsumer>
                {({dispatch}) => {
                    return (
                        <div className="grid-row">
                            <div className="column-full">
                                <h1 className="heading-large">
                                    {title}
                                    {subTitle && <span className="heading-secondary">{subTitle}</span>}
                                </h1>
                                <ul>
                                    <li><Link to={'/action/create'}>Create case</Link></li>
                                    <li><Link to={'/some/random/url'}>Test 404</Link></li>
                                    <li><Link to={'/action/test'}>Test 403</Link></li>
                                    <li><Link to={'/error'}>Test 500</Link></li>
                                </ul>
                            </div>
                        </div>
                    );
                }}
            </ApplicationConsumer>
        )
    }
}

const WrappedPage = props => (
    <ApplicationConsumer>
        {({dispatch}) => <MainPage {...props} dispatch={dispatch}/>}
    </ApplicationConsumer>
);

export default WrappedPage;