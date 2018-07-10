import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends Component {

    static createMenu(menuItems) {
        return (
            <Fragment>
                <label htmlFor="toggle-mobile-menu" aria-label="menu">Menu</label>
                <input id="toggle-mobile-menu" type="checkbox" />
                {
                    menuItems.length && (
                        <ul id="main-menu">
                            {menuItems.map(i => <li key={i.label}><Link to={i.target}>{i.label}</Link></li>)}
                        </ul>)
                }
            </Fragment>
        );
    }

    render() {
        const {
            logoLinkTitle,
            menu,
            propositionHeader,
            propositionHeaderLink,
            service,
            serviceLink
        } = this.props;

        return (
            <Fragment>
                <header role="banner" id="global-header" className="with-proposition">
                    <div className="header-wrapper">
                        <div className="header-global">
                            <div className="header-logo">
                                <a href={serviceLink} title={logoLinkTitle} id="header-application"
                                    className="content">
                                    {service}
                                </a>
                            </div>
                        </div>
                        <div className="header-proposition">
                            <div className="content">
                                <nav id="proposition-menu">
                                    {propositionHeader && <div id="proposition-header">
                                        <a href={propositionHeaderLink} id="proposition-name">{propositionHeader}</a>
                                    </div>}
                                    {menu && Header.createMenu(menu)}
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>
                <div id="global-header-bar" />
            </Fragment>
        );
    }
}

Header.propTypes = {
    logoLinkTitle: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.object),
    propositionHeader: PropTypes.string.isRequired,
    propositionHeaderLink: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    serviceLink: PropTypes.string.isRequired,
};

Header.defaultProps = {
    logoLinkTitle: '',
    menu: [{ label: 'Logout', target: '/' }],
    propositionHeader: 'Service Name',
    propositionHeaderLink: '/',
    service: 'GOV.UK',
    serviceLink: 'https://www.gov.uk'
};

export default Header;