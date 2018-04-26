import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

    createMenu(menuItems) {
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
            menu,
            menuItems,
            userName
        } = this.props;

        return (
            <Fragment>
                <header role="banner" id="global-header" className={propositionHeader ? 'with-proposition' : ''}>
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
                                    <div id="proposition-header">
                                        <a href={propositionHeaderLink} id="proposition-name">{propositionHeader}</a>
                                        {userName ? <span>Logged in as {userName}</span> : null}
                                    </div>
                                    {menu.isVisible ? this.createMenu(menuItems) : null}
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
    propositionHeader: 'My React Application',
    propositionHeaderLink: '/',             
    menu: { isVisible: false },
    menuItems: [{ target: '/', label: 'Test 1' }, { target: '/', label: 'Test 2' }],
    userName: null
};

export default Header;