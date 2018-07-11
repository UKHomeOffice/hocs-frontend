import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ApplicationConsumer } from '../contexts/application.jsx';
import { updateLocation } from '../contexts/actions/index.jsx';

class MainPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(updateLocation(this.props.match));
    }

    render() {
        const {
            subTitle,
            title
        } = this.props;
        return (
            <ApplicationConsumer>
                {() => {
                    return (
                        <div className="grid-row">
                            <div className="column-full">
                                <h1 className="heading-large">
                                    {title}
                                    {subTitle && <span className="heading-secondary">{subTitle}</span>}
                                </h1>
                                <h2 className="heading-medium">
                                  Primary actions
                                </h2>
                                <ul className="list list-bullet">
                                    <li><Link to={'/action/create'}>Create single case</Link></li>
                                    <li><Link to={'/action/bulk'}>Create cases in bulk</Link></li>
                                </ul>
                                <h2 className="heading-medium">
                                  Secondary routes
                                </h2>
                                <ul className="list list-bullet">
                                    <li><Link to={'/some/random/url'}>Test 404</Link></li>
                                    <li><Link to={'/action/test'}>Test 403</Link></li>
                                    <li><Link to={'/error'}>Test 500</Link></li>
                                </ul>
                            </div>
                        </div>
                    );
                }}
            </ApplicationConsumer>
        );
    }
}

MainPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
    subTitle: PropTypes.string,
    title: PropTypes.string
};

const WrappedPage = props => (
    <ApplicationConsumer>
        {({ dispatch }) => <MainPage {...props} dispatch={dispatch} />}
    </ApplicationConsumer>
);

export default WrappedPage;