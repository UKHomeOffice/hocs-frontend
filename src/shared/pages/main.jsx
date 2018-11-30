import React, { Component } from 'react';
import Dashboard from '../pages/dashboard.jsx';

class MainPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <Dashboard />
                </div>
            </div>
        );
    }
}

export default MainPage;