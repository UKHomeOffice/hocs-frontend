import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

class Header extends Component {

    static createLogotype(service, serviceLink) {
        return (
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__logo">
                    <a href={serviceLink} className="govuk-header__link govuk-header__link--homepage">
                        <span className="govuk-header__logotype">
                            <span className="govuk-header__logotype-text">{service}</span>
                        </span>
                    </a>
                </div>
                <div className="govuk-header__content">
                    <nav>
                        <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
                            <li class="govuk-header__navigation-item">
                                <a class="govuk-header__link" href={"/action/create/workflow"}>
                                    Create single case
                                </a>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <a className="govuk-header__link" href={"/action/bulk/workflow"}>
                                    Create cases in bulk
                                </a>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <a className="govuk-header__link" href={"/action/standard_line/add"}>
                                    Add standard line
                                </a>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <a className="govuk-header__link" href={"/action/template/add"}>
                                    Add template
                                </a>
                            </li>
                            <li className="govuk-header__navigation-item">
                                <a className="govuk-header__link" href={"/action/test/form"}>
                                    View test form
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        const {
            service,
            serviceLink
        } = this.props;
        return (
            <header className="govuk-header " role="banner" data-module="header">
                <div className="govuk-header__container govuk-width-container">
                    {Header.createLogotype(service, serviceLink)}
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    service: PropTypes.string.isRequired,
    serviceLink: PropTypes.string.isRequired,
};

Header.defaultProps = {
    service: 'GOV.UK',
    serviceLink: 'https://www.gov.uk'
};

export default Header;