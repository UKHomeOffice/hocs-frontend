import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Workstack from '../common/components/workstack.jsx';

class MainPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            caption,
            title
        } = this.props;

        return (
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <h1 className="govuk-heading-l">
                        {caption && <span className="govuk-caption-l">{caption}</span>}
                        {title}
                    </h1>
                    <h2 className="govuk-heading-m">
                        Primary actions
                    </h2>
                    <ul className="govuk-list govuk-list--bullet">
                        <li><Link to={'/action/create/workflow'}>Create single case</Link></li>
                        <li><Link to={'/action/bulk/workflow'}>Create cases in bulk</Link></li>
                        <li><Link to={'/action/test/form'}>View test form</Link></li>
                    </ul>
                    <Workstack />
                </div>
            </div>
        );
    }
}

MainPage.propTypes = {
    caption: PropTypes.string,
    match: PropTypes.object,
    title: PropTypes.string
};

export default MainPage;