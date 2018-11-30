import React, { Component } from 'react';
import Link from "react-router-dom";

class Header extends Component {

    static createLogotype() {
        return (
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__logo">
                    <span className="govuk-header__logotype">
                        <Link to="/" className="govuk-header__link govuk-header__link--homepage govuk-header__logotype-text">Correspondence Service</Link>
                    </span>
                </div>
                <div className="govuk-header__content">
                    <nav>
                        <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
                            <li class="govuk-header__navigation-item">
                                <Link to="/action/create/workflow" className="govuk-header__link" >Create single case</Link>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <Link to="/action/bulk/workflow" className="govuk-header__link">Create cases in bulk</Link>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <Link to="/action/standard_line/add" className="govuk-header__link">Add standard line</Link>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <Link to="/action/template/add" className="govuk-header__link">Add template</Link>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <Link to="/action/test/form" className="govuk-header__link">View test form</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        return (
            <header className="govuk-header" role="banner" data-module="header">
                <div className="govuk-header__container govuk-width-container">
                    { Header.createLogotype() }
                </div>
            </header>
        );
    }
}

export default Header;