import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formEnabled from './form-enabled.jsx';
import SideBar from '../common/components/side-bar.jsx';

class Case extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSidebar: false
        };
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        const urlParams = new URLSearchParams(window.location.search);
        const hideSidebar = urlParams.get('hideSidebar');
        this.setState({
            hideSidebar: hideSidebar || true
        });
    }

    render() {
        const {
            children,
            form,
            title
        } = this.props;

        return (
            <div className="govuk-grid-row">
                <div className={`govuk-grid-column-one-${this.shouldDisplaySidebar() ? 'third' : 'half'}`}>
                    {title && <h1 className="govuk-heading-l">
                        {title}
                        {form && <span className="govuk-caption-l">{form && form.caseReference}</span>}
                    </h1>}
                    {children}
                </div>
                {this.shouldDisplaySidebar() && <div className="govuk-grid-column-two-thirds">
                    <SideBar />
                </div>}
            </div>
        );
    }

    shouldDisplaySidebar() {
        if (this.state.hideSidebar === 'true') {
            return false;
        }

        if (this.state.hideSidebar === 'false') {
            return true;
        }
        return this.props.hasSidebar;
    }

}

Case.defaultProps = {
    hasSidebar: false
};

Case.propTypes = {
    children: PropTypes.node,
    form: PropTypes.object,
    title: PropTypes.string,
    hasSidebar: PropTypes.bool,
    hideSidebar: PropTypes.string,
};

export default formEnabled(Case);
