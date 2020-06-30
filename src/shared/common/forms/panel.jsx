import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationConsumer } from '../../contexts/application.jsx';

class Panel extends Component {
    /*
     * A visible container used on confirmation or results pages to highlight important content
     */
    render() {
        const { title, children, csrf } = this.props;

        return (
            <div>
                <div className="govuk-panel govuk-panel--confirmation">
                    {title && <h1 className="govuk-panel__title">{title}</h1>}
                    <div className="govuk-panel__body">{children.summary}
                    </div>
                </div>
                {/* todo: why is the body not passed to the csrf parsing? */}
                {children.link &&
                    <form action={`/search/reference?_csrf=${csrf}`} method='POST'
                        encType='multipart/form-data'>
                        <input className="govuk-input" id="case-reference" type="hidden" name="case-reference"
                            value={children.link} />
                        <input className="govuk-button-panel--link" id="submit" type="submit"
                            value={children.link} />
                    </form>
                }
            </div>
        );
    }
}

Panel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    csrf: PropTypes.string
};

const WrappedPanel = props => (
    <ApplicationConsumer>
        {({ csrf }) => <Panel {...props} csrf={csrf} />}
    </ApplicationConsumer>
);

export default WrappedPanel;
