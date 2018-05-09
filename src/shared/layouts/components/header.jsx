import React, { Component, Fragment } from 'react';
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
            service,
            serviceLink,
            logoLinkTitle,
            propositionHeader,
            propositionHeaderLink,         
            menu
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

Header.defaultProps = {
    service: 'GOV.UK',
    serviceLink: 'https://www.gov.uk',
    logoLinkTitle: '',
    propositionHeader: 'Service Name',
    propositionHeaderLink: '/',             
    menu: [{label: 'Logout', target: '/'}]
};

export default Header;