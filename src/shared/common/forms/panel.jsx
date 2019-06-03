import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Panel extends Component {
    /*
     * A visible container used on confirmation or results pages to highlight important content
     */
    render() {
        const { title, children } = this.props;

        return (
            <div className="govuk-panel govuk-panel--confirmation">
                <h1 className="govuk-panel__title">{title}</h1>
                <div className="govuk-panel__body">{children.summary}
                    { children.link &&
                        <form action='/search/reference' method='POST'
                              onSubmit={e => submitHandler(e, baseUrl + allocateToTeamEndpoint)}
                              encType='multipart/form-data'>
                            <input className="govuk-input" id="case-reference" type="hidden" name="case-reference"
                                   value={children.link}/>
                            <input className="govuk-button-panel--link" id="submit" type="submit"
                                   value={children.link}/>
                        </form>
                    }
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
};
