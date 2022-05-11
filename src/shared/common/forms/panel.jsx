import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';
import { Link } from 'react-router-dom';

class Panel extends Component {

    renderSummary(children) {
        const summary = children?.summary;

        if (!summary) {
            return;
        }

        return (<div className="govuk-panel__body">
            {children.summary}
        </div>);
    }

    renderLink(children, csrf) {
        const link = children?.link;

        if (!link) {
            return;
        }

        if (typeof link === 'string') {
            return (<form action={`/search/reference?_csrf=${csrf}`} method='POST'
                encType='multipart/form-data'>
                <input className="govuk-input" id="case-reference" type="hidden" name="case-reference"
                    value={children.link} />
                <input className="govuk-button-panel--link" id="submit" type="submit"
                    value={children.link} />
            </form>);
        } else if (typeof link === 'object') {
            return (<Link to={children.link.href} className="govuk-input govuk-button-panel--link">
                {children.link.label}
            </Link>);
        }
    }

    /*
     * A visible container used on confirmation or results pages to highlight important content
     */
    render() {
        const { title, children, csrf } = this.props;

        return (
            <div>
                <div className="govuk-panel govuk-panel--confirmation">
                    {title && <h1 className="govuk-panel__title">{title}</h1>}
                    {this.renderSummary(children)}
                </div>
                {this.renderLink(children, csrf)}
            </div>
        );
    }
}

Panel.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    csrf: PropTypes.string
};

const WrappedPanel = props => (
    <ApplicationConsumer>
        {({ csrf }) => <Panel {...props} csrf={csrf} />}
    </ApplicationConsumer>
);

export default WrappedPanel;
