import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends Component {

    createLogotype(service, serviceLink) {
        return (
            <div className='govuk-header__container govuk-width-container'>
                <div className='govuk-header__logo'>
                    <span className='govuk-header__logotype'>
                        <Link to={serviceLink} className='govuk-header__link govuk-header__link--homepage govuk-header__logotype-text'>{service}</Link>
                    </span>
                </div>
                <div className='govuk-header__content'>
                    <nav>
                        <ul id='navigation' className='govuk-header__navigation ' aria-label='Top Level Navigation'>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/create/workflow' className='govuk-header__link'>Create single case</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/bulk/workflow' className='govuk-header__link'>Create cases in bulk</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/standard_line/add' className='govuk-header__link'>Add standard line</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/template/add' className='govuk-header__link'>Add template</Link>
                            </li>
                            <li className='govuk-header__navigation-item'>
                                <Link to='/action/test/form' className='govuk-header__link'>View test form</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    render() {
        const { service, serviceLink } = this.props;
        return (
            <header className='govuk-header ' role='banner' data-module='header'>
                <div className='govuk-header__container govuk-width-container'>
                    {this.createLogotype(service, serviceLink)}
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
    service: 'Correspondence Service',
    serviceLink: '/'
};

export default Header;