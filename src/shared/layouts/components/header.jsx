import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends Component {

    createLogotype(service, serviceLink, bulkCreateEnabled, viewStandardLinesEnabled) {
        return (
            <div className='govuk-header__container govuk-width-container'>
                <a href='#main-content' className='govuk-skip-link'>Skip to main content</a>
                <div className='govuk-header__logo'>
                    <span className='govuk-header__logotype'>
                        <Link to={serviceLink} className='govuk-header__link govuk-header__link--homepage govuk-header__logotype-text'>{service}</Link>
                    </span>
                </div>
                <div className='govuk-header__content'>
                    <nav>
                        <ul id='navigation' className='govuk-header__navigation ' aria-label='Top Level Navigation'>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/create/workflow' className='govuk-header__link'>Create Single Case</Link>
                            </li>
                            {bulkCreateEnabled && <li className='govuk-header__navigation-item'>
                                <Link to='/action/bulk/workflow' className='govuk-header__link'>Create Bulk Cases</Link>
                            </li>
                            }
                            {viewStandardLinesEnabled && <li className='govuk-header__navigation-item'>
                                <Link to='/view-standard-lines' className='govuk-header__link'>View Standard Lines</Link>
                            </li>}
                            <li className='govuk-header__navigation-item'>
                                <Link to='/search' className='govuk-header__link'>Search</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/overview' className='govuk-header__link'>Overview</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <a href='/oauth/logout' className='govuk-header__link'>Logout</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        const { service, serviceLink, bulkCreateEnabled, viewStandardLinesEnabled } = this.props;
        return (
            <header className='govuk-header ' role='banner' data-module='header'>
                {this.createLogotype(service, serviceLink, bulkCreateEnabled, viewStandardLinesEnabled)}
            </header>
        );
    }

}

Header.propTypes = {
    service: PropTypes.string.isRequired,
    serviceLink: PropTypes.string.isRequired,
    bulkCreateEnabled: PropTypes.bool.isRequired,
    viewStandardLinesEnabled: PropTypes.bool.isRequired
};

Header.defaultProps = {
    service: 'Correspondence Service',
    serviceLink: '/',
    bulkCreateEnabled: true
};

export default Header;
