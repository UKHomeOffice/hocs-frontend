import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConfirmationWithTeamNameAndCaseRef extends Component {

    extractRequiredTeam(data, name, choices) {
        return name ? choices.find(choice => choice.key === data[name]).value : '';
    }

    render() {

        const {
            label,
            caseRef,
            choices,
            data,
            hasHeader,
            name
        } = this.props;

        const teamName = this.extractRequiredTeam(data, name, choices);

        return (
            <div>
                {hasHeader &&
                    <div className="govuk-panel govuk-panel--confirmation">
                        <div className="govuk-panel__body">Case {label}: {teamName}
                        </div>
                    </div>
                }
                <h2 className="govuk-heading-m">
                    Case {caseRef} {label} {teamName}
                </h2>
            </div>
        );
    }
}

ConfirmationWithTeamNameAndCaseRef.propTypes = {
    label: PropTypes.string,
    caseRef: PropTypes.string,
    choices: PropTypes.array,
    data: PropTypes.object,
    hasHeader: PropTypes.bool,
    name: PropTypes.string
};

